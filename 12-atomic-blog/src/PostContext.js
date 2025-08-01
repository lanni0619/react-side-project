import { createContext, useContext, useState } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
    return {
        title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
        body: faker.hacker.phrase(),
    };
}

// 1) CREATE A CONTEXT
// PostContext is a component ( uppercase letter at the beginning )
const PostContext = createContext();

function PostProvider({ children }) {
    const [posts, setPosts] = useState(() => Array.from({ length: 30 }, () => createRandomPost()));
    const [searchQuery, setSearchQuery] = useState("");

    // Derived state. These are the posts that will actually be displayed
    const searchedPosts =
        searchQuery.length > 0
            ? posts.filter((post) => `${post.title} ${post.body}`.toLowerCase().includes(searchQuery.toLowerCase()))
            : posts;

    function handleAddPost(post) {
        setPosts((posts) => [post, ...posts]);
    }

    function handleClearPosts() {
        setPosts([]);
    }

    return (
        // 2) PROVIDE VALUE TO CHILD COMPONENTS
        <PostContext.Provider
            value={{
                posts: searchedPosts,
                onClearPosts: handleClearPosts,
                searchQuery,
                setSearchQuery,
                onAddPost: handleAddPost,
            }}
        >
            {children}
        </PostContext.Provider>
    );
}

function usePosts() {
    const context = useContext(PostContext);
    if (context === undefined) throw new Error("PostContext was used outside of the PostProvider");
    return context;
}

export { PostProvider, usePosts, createRandomPost };
