import '../styles/List.css'


export const List = ({filteredList}) => {

    const slicedList = filteredList.slice(0, 6);

    return (
        <div className='cardContainer'>
        <ul >
        {slicedList.map((building) => (
        <li className="card" key={building.name_fi}>
            <h1>{building.name_fi}</h1>
            
            

            <p>{building.short_desc_fi}</p>

            <figure className='picture_url'>
                <img src={building.picture_url} alt="Kuvaa ei löydy" />
            </figure>
            
        </li>
          
        ))}
      </ul>
      </div>
            

    );
}