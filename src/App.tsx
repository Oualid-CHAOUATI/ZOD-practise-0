import { useState, useEffect } from "react";
import { z } from "zod";

// 🦁 Crée un schéma et extrais le type du Schéma
const ZAddress = z.object({
  street: z.string(),
  suite: z.string(),
  city: z.string(),
  zipcode: z.string(),
  geo: z.object({
    lat: z.string(),
    lng: z.string(),
  }),
});

const ZCompany = z.object({
  name: z.string(),
  catchPhrase: z.string(),
  bs: z.string(),
});

const ZUser = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  address: ZAddress,
  phone: z.string(),
  website: z.string(),
  company: ZCompany,
});

const ZUsersArray = z.array(ZUser);

type User = z.infer<typeof ZUser>;

const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/users"
  ).then((res) => res.json());

  // 🦁 Utilise le schéma pour vérifier le user

  const usersArray = ZUsersArray.parse(response);
  return usersArray;
};

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  // 🦁 Ajoute un state d'erreur
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 🦁 Ajoute un .catch et définis le state d'erreur

    fetchUsers()
      .then((users) => setUsers(users))
      .catch((err) => {
        setError(JSON.stringify(err));
      });
  }, []);

  return (
    <div className="App">
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <p>
              Name : <b>{user.name}</b>
            </p>
            <p>
              Email : <b>{user.email}</b>
            </p>
            <a href={user.website}>{user.website}</a>
          </li>
        ))}
      </ul>
      {error}
    </div>
  );
}
