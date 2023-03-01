import axios from "axios";
import Link from "next/link";
import {
  Input,
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import { useState } from "react";

export async function getServerSideProps({ query }) {
  const page = query.page || 1;
  const limit = 25;
  const offset = (page - 1) * limit;
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/posts?_start=${offset}&_limit=${limit}`
  );
  const posts = response.data;
  const totalPosts = response.headers["x-total-count"];
  const totalPages = Math.ceil(totalPosts / limit);
  return { props: { posts, totalPages } };
}

export default function Home({ posts, totalPages }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [postList, setPostList] = useState(posts);

  async function handleDelete(postId) {
    try {
      await axios.delete(
        `https://jsonplaceholder.typicode.com/posts/${postId}`
      );
      setPostList((prevPostList) =>
        prevPostList.filter((post) => post.id !== postId)
      );
    } catch (error) {
      console.log(error);
    }
  }
  function handleSearchInputChange(event) {
    setSearchQuery(event.target.value);
  }
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleEdit(newTitle, postId) {
    setPostList((prevPostList) =>
      prevPostList.map((post) => {
        if (post.id === postId) {
          return { ...post, title: newTitle };
        }
        return post;
      })
    );
  }

  function handlePageClick(selectedPage) {
    const page = selectedPage.selected + 1;
    router.push(`/?page=${page}`);
  }

  return (
    <Box maxW="800px" mx="auto" py={8} px={4}>
      <Link href="/users" as={"/users"} passHref>
        <Button as="a" size="sm">
          User List
        </Button>
      </Link>
      <Heading as="h1" size="xl" mb={8}>
        Heavnn / Furkan Blog
      </Heading>
      <Input
        type="text"
        placeholder="Search posts by title"
        value={searchQuery}
        onChange={handleSearchInputChange}
        mb={4}
      />
      <VStack align="stretch" spacing={4}>
        {postList.map((post) => (
          <Box key={post.id} bg="white" shadow="md" borderRadius="md" p={4}>
            <Link href="/posts/[id]" as={`/posts/${post.id}`} passHref>
              <Button as="a" size="sm">
                Article Page
              </Button>
            </Link>

            <Editable
              defaultValue={post.title}
              fontSize="xl"
              fontWeight="bold"
              color="blue.500"
              mb={2}
              onSubmit={(newTitle) => handleEdit(newTitle, post.id)}
            >
              <EditablePreview as="a" href={`/posts/${post.id}`} />
              <EditableInput />
            </Editable>
            <Text fontSize="lg">{post.body}</Text>
            <Button colorScheme="red" onClick={() => handleDelete(post.id)}>
              Delete
            </Button>
          </Box>
        ))}
      </VStack>
      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        breakLabel={"..."}
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </Box>
  );
}
