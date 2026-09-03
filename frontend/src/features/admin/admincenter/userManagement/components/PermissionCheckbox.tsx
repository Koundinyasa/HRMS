import { FaCheckSquare, FaRegSquare } from "react-icons/fa";

type PermissionCheckboxProps = {
  checked: boolean;
  color: string;
  onClick: () => void;
};

const PermissionCheckbox = ({ checked, color, onClick }: PermissionCheckboxProps) => {
  return (
    <button onClick={onClick} className="flex items-center justify-center w-full">
      {checked ? (
        <FaCheckSquare className={`text-lg ${color}`} />
      ) : (
        <FaRegSquare className="text-lg text-gray-400" />
      )}
    </button>
  );
};

export default PermissionCheckbox;
