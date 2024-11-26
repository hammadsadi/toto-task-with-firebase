import { Spinner } from '@material-tailwind/react';

const Loader = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Spinner color="green" className="w-14 h-14" />
    </div>
  );
}

export default Loader
