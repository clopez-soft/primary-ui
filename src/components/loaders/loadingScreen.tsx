

import Loading from 'src/components/loaders/hourglass';
// import Loading from 'src/components/loaders/oficial';

export default function LoadingScreen({ ...other }) {

    return <Loading center={true} {...other} />
}
