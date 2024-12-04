
const Button = ({ onClick, children }: { onClick: () => void, children: React.ReactNode }) => {
    return (
        <div onClick={onClick} className="bg-green-600 p-1 px-4 rounded-md text-xl text-white font-bold cursor-pointer hover:bg-green-700 flex gap-1 justify-center items-center">
            {children}
        </div>
    )
}

export default Button
