/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from "react";
import { Button } from "@mui/material";

type UploadImageButtonProp = {
  onSelect: (img: File) => void;
};

export const UploadImageButton = ({ onSelect }: UploadImageButtonProp) => {
  const hiddenFileInput = useRef(null);

  const handleClick = () => {
    if (hiddenFileInput && hiddenFileInput.current) {
      //hiddenFileInput.current.click();
    }
  };

  const handleChange = (event: any) => {
    const fileUploaded = event.target.files[0];
    onSelect(fileUploaded);
  };

  return (
    <>
      <Button onClick={handleClick}>Upload a file</Button>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </>
  );
};
