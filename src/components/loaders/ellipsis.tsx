
const EllipsisLoader = ({ center = false }) => {

    const loader = (
        <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div> </div>
            <div></div>
        </div>
    );

    if (center)
        return <div style={{ marginLeft: 'calc(50% - 4rem)' }}>
            {loader}
        </div>
    else
        return loader;
}

export default EllipsisLoader;