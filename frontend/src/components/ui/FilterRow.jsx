const wrapStyle = "relative rounded-md bg-zinc-900";
const iconStyle = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400";
const filterStyle = "relative block bg-transparent rounded-md py-2 pl-10 pr-4 focus:outline-2 focus:outline-cyan-500";

export default function FilterRow({ fields, filters, options = {}, onChange }) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-3">
      {fields.map(({ name, type, placeholder, all, icon: Icon }) => (
        <div key={name} className={wrapStyle}>
          <Icon size={20} className={iconStyle} />
          {type === "search" ? (
            <input name={name} type="text" placeholder={placeholder} value={filters[name]} onChange={onChange} className={`${filterStyle} w-56`} />
          ) : (
            <select name={name} value={filters[name]} onChange={onChange} className={`${filterStyle} cursor-pointer`}>
              <option value="" className="bg-zinc-900">{all}</option>
              {options[name]?.map(({ value, label }) => (
                <option key={value} value={value} className="bg-zinc-900">{label}</option>
              ))}
            </select>
          )}
        </div>
      ))}
    </div>
  )
}