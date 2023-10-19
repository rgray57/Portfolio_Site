export default function(props) {

    const { algos, value, onSelect } = props;

    return(
        <div className="algorithm-dropdown">
            <label for="algorithm-select">Select Algorithm: </label>
            <select value={value} id="algorithm-select" onChange={onSelect}>
                {algos.map(algo => {
                    return <option value={algo}>{algo}</option>
                })}
            </select>
        </div>
    )
}