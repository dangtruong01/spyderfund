interface SearchBarProps {
  placeholder: string;
  onSearch: (arg: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch }) => {
  return (
    <div className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-gray-accent rounded-[100px]">
      <input
        type="text"
        placeholder={placeholder}
        className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none"
      />

      <div className="w-[72px] h-full rounded-[20px] bg-pink-300 flex justify-center items-center cursor-pointer">
        <img
          src={"src/assets/search.svg"}
          alt="search"
          className="w-[15px] h-[15px] object-contain"
        />
      </div>
    </div>
  );
};

export default SearchBar;
