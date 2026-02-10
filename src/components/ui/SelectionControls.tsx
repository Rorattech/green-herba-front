interface ControlProps {
    label: string;
    colorTheme?: 'light' | 'dark';
    disabled?: boolean;
  }
  
  export const Checkbox = ({ label, colorTheme = 'light', disabled }: ControlProps) => (
    <label className={`flex items-center gap-3 cursor-pointer group ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
      <div className="relative flex items-center justify-center">
        <input type="checkbox" className="peer sr-only" disabled={disabled} />
        <div className={`w-5 h-5 rounded border transition-all 
          ${colorTheme === 'light' ? 'border-gray-300 bg-white' : 'border-green-600/50 bg-green-800/20'}
          peer-checked:bg-green-700 peer-checked:border-green-700`} 
        />
        <svg className="absolute w-3 h-3 text-green-100 opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className={`text-body-m font-medium ${colorTheme === 'light' ? 'text-black' : 'text-green-100'}`}>
        {label}
      </span>
    </label>
  );
  
  export const RadioButton = ({ label, colorTheme = 'light', disabled }: ControlProps) => (
    <label className={`flex items-center gap-3 cursor-pointer group ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
      <div className="relative flex items-center justify-center">
        <input type="radio" name="radio-group" className="peer sr-only" disabled={disabled} />
        <div className={`w-5 h-5 rounded-full border transition-all 
          ${colorTheme === 'light' ? 'border-gray-300 bg-white' : 'border-green-600/50 bg-green-800/20'}
          peer-checked:border-green-700`} 
        />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-green-700 opacity-0 peer-checked:opacity-100 transition-opacity" />
      </div>
      <span className={`text-body-m font-medium ${colorTheme === 'light' ? 'text-black' : 'text-green-100'}`}>
        {label}
      </span>
    </label>
  );