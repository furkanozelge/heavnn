import React, { useState, useEffect } from 'react';
import { Input, Stack, Heading, Box, Text } from '@chakra-ui/react';

function User({ user }) {
  return (
    <Box borderWidth="1px" borderRadius="lg" p="4">
      <Heading size="md">{user.name}</Heading>
      <Text>Username: {user.username}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Address: {user.address.street}, {user.address.city}, {user.address.zipcode}</Text>
    </Box>
  );
}

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.log(error));
  }, []);

  const filteredUsers = users.filter(user => {
    const name = user.name.toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search);
  });

  return ( 
  <Box maxW="800px" mx="auto" py={8} px={4}>
    <Stack spacing="6">
      <Input type="text" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Search by name" />
      {filteredUsers.map(user => (
        <User key={user.id} user={user} />
      ))}
    </Stack>
    </Box>
  );
}

export default UsersPage;
