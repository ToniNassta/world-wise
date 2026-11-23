import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCities } from "../context/CitiesContext";

function CountryList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;

  if (cities.length === 0) return <Message message="Add cities to your list" />;

  const countries = cities.reduce((acc, city) => {
    if (!acc.some((el) => el.country === city.country))
      return [...acc, { country: city.country, emoji: city.emoji }];
    else return acc;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountryList;
