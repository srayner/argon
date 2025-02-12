type ErrorProps = {
  message: string;
};

const Error: React.FC<ErrorProps> = ({ message }) => {
  return (
    <p text-sm className="text-red-500 mb-1 px-1">
      {message}
    </p>
  );
};

export default Error;
