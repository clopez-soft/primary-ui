const HourglassLoader = ({ center = false }) => {

    const loader = <div className="lds-hourglass"></div>;

    if (center)
        return <div style={{ marginLeft: 'calc(50% - 4rem)' }}>
            {loader}
        </div>
    else
        return loader;
}

export default HourglassLoader;