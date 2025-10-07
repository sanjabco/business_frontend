import {TextField, InputAdornment} from '@mui/material';

const PriceInput = ({value, onChange, label, error, helperText}) => {
    const handleChange = (e) => {
        const rawValue = e.target.value.replace(/,/g, '');
        if (!isNaN(rawValue)) {
            onChange(rawValue);
        }
    };

    const formatValue = (value) => {
        if (!value) return '';
        return Number(value).toLocaleString('en-US');
    };

    return (
        <TextField
            label={label}
            variant="outlined"
            size="small"
            fullWidth
            value={formatValue(value)}
            onChange={handleChange}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <span style={{color: 'Gray'}}>ریال</span>
                    </InputAdornment>
                ),
            }}
            error={error}
            helperText={helperText}
        />
    );
};

export default PriceInput;
