import { useEffect, useState } from "react";
import { api } from "./services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get("/posts");
      setPosts(response.data);
    } catch (error) {
      toast.error("Gagal mengambil data!");
    }
  };

  const addPost = async () => {
    try {
      const response = await api.post("/posts", { title, content });
      setPosts([...posts, response.data]);
      setTitle("");
      setContent("");
      toast.success("Post berhasil ditambahkan!");
    } catch (error) {
      toast.error("Gagal menambahkan post!");
    }
  };

  const deletePost = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
  
      // Kalau post yang dihapus itu lagi diedit, reset input
      if (editId === id) {
        setEditId(null);
        setTitle("");
        setContent("");
      }
  
      toast.success("Post berhasil dihapus!");
    } catch (error) {
      toast.error("Gagal menghapus post!");
    }
  };
  

  const updatePost = async () => {
    try {
      await api.put(`/posts/${editId}`, { title, content });
      setPosts(
        posts.map((post) =>
          post.id === editId ? { ...post, title, content } : post
        )
      );
      setEditId(null);
      setTitle("");
      setContent("");
      toast.success("Post berhasil diperbarui!");
    } catch (error) {
      toast.error("Gagal memperbarui post!");
    }
  };

  const startEdit = (post) => {
    setEditId(post.id);
    setTitle(post.title);
    setContent(post.content);
  };

  

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Daftar Post</h1>
      <input
        type="text"
        placeholder="Title"
        className="border p-2 m-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Content"
        className="border p-2 m-2"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      {editId ? (
        <button onClick={updatePost} className="bg-green-500 text-white p-2">
          Update Post
        </button>
      ) : (
        <button onClick={addPost} className="bg-blue-500 text-white p-2">
          Tambah Post
        </button>
      )}

      <ul>
        {posts.map((post) => (
          <li key={post.id} className="border p-2 my-2 flex justify-between">
            <div>
              <h2 className="font-semibold">{post.title}</h2>
              <p>{post.content}</p>
            </div>
            <div>
              <button
                onClick={() => startEdit(post)}
                className="bg-yellow-500 text-white p-2 mx-1"
              >
                Edit
              </button>
              <button
                onClick={() => deletePost(post.id)}
                className="bg-red-500 text-white p-2"
              >
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Wajib taruh ToastContainer biar notifikasinya muncul */}
      <ToastContainer />
    </div>
  );
}

export default App;
