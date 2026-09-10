type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
};

export default function FormInput({
	label,
	type,
	className,
	onClick,
	...props
}: FormInputProps) {
	const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
		if (type === "date" && "showPicker" in e.currentTarget) {
			e.currentTarget.showPicker();
		}
		if (onClick) onClick(e);
	};

	const inputElement = (
		<input
			type={type}
            onClick={handleClick}
            className={`bg-gray-100 text-lg text-gray-700 p-3 rounded placeholder:text-gray-500 focus:bg-white focus:outline-2 focus:outline-[#3F6E4A] focus:border-0  hover:outline-[#A4CBA9] hover:outline-2 disabled:opacity-50 disabled:outline-0 ${className}`}
            {...props}
		/>
	);

	if (label) {
		return (
			<label className="flex flex-col">
				{label}
				{inputElement}
			</label>
		);
	}

	return inputElement;
}
