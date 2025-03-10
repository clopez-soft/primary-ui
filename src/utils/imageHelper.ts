import imageCompression from "browser-image-compression";
import { toSafeString } from "./helper";

const ReadFile = (file: File) => {
  return new Promise((resolve, reject) => {
    if (!file) reject("Invalid file");

    const fr = new FileReader();
    fr.onload = (e) => {
      resolve(e?.target?.result);
    };
    fr.readAsDataURL(file);
  });
};

export const CompressImageFromInputFile = async (
  inputFile: File,
  maxSizeMB = 1,
  maxWidthOrHeight = 1920,
  maxupUploadSizeMb = 10
) => {
  try {
    if (!inputFile) throw new Error("Invalid file");

    if (inputFile.type.split("/")[0] !== "image")
      throw new Error("The file must be a valid image");

    const size_org = inputFile.size / 1024 / 1024;
    if (size_org > maxupUploadSizeMb)
      throw new Error(`The file exceeds the ${maxupUploadSizeMb}MB size limit`);

    const options = {
      maxSizeMB: maxSizeMB,
      maxWidthOrHeight: maxWidthOrHeight,
      useWebWorker: false,
    };

    const compressedFile = await imageCompression(inputFile, options);

    if (maxupUploadSizeMb > 0) {
      const size = compressedFile.size / 1024 / 1024;

      if (size > maxupUploadSizeMb)
        throw new Error(
          `The file exceeds the ${maxupUploadSizeMb}MB size limit after compressed`
        );
    }

    const readerResult = await ReadFile(compressedFile);

    return toSafeString(readerResult);
  } catch (error: any) {
    throw new Error(error);
  }
};

const blobToFile = (theBlob: Blob, fileName: string): File => {
  var b: any = theBlob;
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  b.lastModifiedDate = new Date();
  b.name = fileName;

  //Cast to a File() type
  return theBlob as File;
};

export const CompressImageFromBase64Image = async (
  base64 = "",
  maxSizeMB = 1,
  maxWidthOrHeight = 1920,
  maxupUploadSizeMb = 10
) => {
  try {
    if (!base64) throw new Error("Invalid base64");

    const type = base64.substring(0, 10);
    if (type !== "data:image")
      throw new Error("The file must be a valid image");

    const response = await fetch(base64);
    if (!response) throw new Error("Image could not be fetched.");

    const blob = await response.blob();
    if (!blob) throw new Error("The blob object is invalid.");

    const options = {
      maxSizeMB: maxSizeMB,
      maxWidthOrHeight: maxWidthOrHeight,
      useWebWorker: false,
    };

    const compressedFile = await imageCompression(
      blobToFile(blob, "my-image.png"),
      options
    );

    if (maxupUploadSizeMb > 0) {
      const size = compressedFile.size / 1024 / 1024;

      if (size > maxupUploadSizeMb)
        throw new Error(
          `The file exceeds the ${maxupUploadSizeMb}MB size limit after compressed`
        );
    }

    const readerResult = await ReadFile(compressedFile);

    return readerResult;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const GetRatioFromImage = (url = "") => {
  return new Promise((resolve, reject) => {
    if (!url) reject("Invalid url");

    try {
      var img = new Image();
      img.onload = function () {
        const ratioImg = img.height / img.width;
        resolve({ ratio: ratioImg, height: img.height, width: img.width });
      };
      img.src = url;
    } catch (error: any) {
      reject(new Error(error?.message || "Cannot download image"));
    }
  });
};

export const GetAverageImageColor = (
  imageElement: HTMLImageElement,
  ratio: number
) => {
  const canvas = document.createElement("canvas");

  let height = (canvas.height = imageElement.naturalHeight);
  let width = (canvas.width = imageElement.naturalWidth);

  const context = canvas.getContext("2d");

  context?.drawImage(imageElement, 0, 0);

  let data, length;
  let i = -4,
    count = 0;

  try {
    // Set data to the context image data of the full image,from x: 0 & y: 0 to x: width & y: height
    data = context?.getImageData(0, 0, width, height);
    if (!data) throw new Error("error on context getImage");

    // Set the length variable to the image data length
    length = data.data.length || 0;
  } catch (err) {
    // Catch errors and return black as color
    console.error(err);
    return { R: 0, B: 0, G: 0 };
  }

  // Init the R, G & B ariables for the RGB Value
  let R, G, B;

  // Set the R, G & B variables to zero (pure black)
  R = G = B = 0;

  while ((i += ratio * 4) < length) {
    // Count up before setting the variables
    ++count;

    // Adding the Color Amount of the current data to the R, G & B variables
    R += data.data[i];
    G += data.data[i + 1];
    B += data.data[i + 2];
  }

  // Rounding and dividing the R, G & B Values by the data count
  R = ~~(R / count);
  G = ~~(G / count);
  B = ~~(B / count);

  //Return the average
  return { R, G, B };
};

export function getFileSizeFromUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!url) reject("Invalid url");

    const http = new XMLHttpRequest();

    http.open("HEAD", url, true); // true = Asynchronous

    http.onerror = function () {
      reject(new Error("Cannot download file"));
    };

    http.onabort = function () {
      reject(new Error("Cannot download file"));
    };

    http.onreadystatechange = function () {
      if (this.readyState === this.DONE) {
        if (this.status === 200) {
          const fileSize = this.getResponseHeader("content-length") || "0";
          resolve(fileSize);
        }
      }
    };

    http.send();
  });
}
