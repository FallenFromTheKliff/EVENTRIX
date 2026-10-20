import DroppingDown from "./DroppingDown";

const wrapStyle = "relative rounded-md bg-zinc-900";
const iconStyle = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400";
const filterStyle = "bg-transparent rounded-md py-2 focus:outline-2 focus:outline-cyan-500";

export default function FilterRow({ fields, filters, options = {}, onChange }) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-3">
      {fields.map(({ name, type, placeholder, all, icon: Icon }) => (
        <div key={name} className={wrapStyle}>
          {type === "search" ? (
            <>
              <Icon size={20} className={iconStyle} />
              <input
                name={name}
                type="text"
                placeholder={placeholder}
                value={filters[name]}
                onChange={onChange}
                className={`${filterStyle} relative block w-76 pl-10 pr-4`}
              />
            </>
          ) : (
            <DroppingDown
              value={filters[name]}
              options={options[name]}
              all={all}
              icon={<Icon size={20} className="text-gray-400" />}
              className={`${filterStyle} w-56 px-3`}
              onChange={(value) => onChange({ target: { name, value } })}
            />
          )}
        </div>
      ))}
    </div>
  )
}