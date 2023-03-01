import { Box, Button, Heading, Text, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";

export async function getServerSideProps({ params }) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${params.id}`
  );
  const post = await response.json();
  return { props: { post } };
}

export default function Post({ post }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);

  async function handleSaveClick() {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${post.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: post.id,
          title,
          body,
        }),
      }
    );
    const updatedPost = await response.json();
    setIsEditing(false);
  }

  return (
    <Box maxW="800px" mx="auto" py={8} px={4}>
      <Box bg="white" shadow="md" borderRadius="md" p={4}>
        {isEditing ? (
          <>
            <Textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              mb={4}
            />
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              mb={4}
            />
            <Button colorScheme="green" mr={4} onClick={handleSaveClick}>
              Save
            </Button>
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          </>
        ) : (
          <>
            <Heading as="h1" size="xl" mb={4}>
              {post.title}
            </Heading>
            <Text fontSize="lg" mb={4}>
              {post.body}
            </Text>
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          </>
        )}
      </Box>
    </Box>
  );
}
