type ErrorProps = {
  message: string;
};

const Error: React.FC<ErrorProps> = ({ message }) => {
  return (
    <p text-sm className="text-red-500 mb-2">
      {message}
    </p>
  );
};

export default Error;
