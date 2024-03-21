import {useState, useEffect} from "react"
import axios from "axios"

export function InfinteScroll() {
  const [post, setPost] = useState([])
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false)
  const [hasMoreData, setHasMoreData] = useState(true)


  const fetchPosts = async() => {
    if(isLoading) return;

    setIsLoading(true);

    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=20`
      )

      if(response.data.length > 0) {
        setPost((prevPost) => [...prevPost, ... response.data])
      } else {
        setHasMoreData(false)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(()=> {
    fetchPosts()
  }, [page])

  const handleScroll = () => {
    if(window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80 && !isLoading && hasMoreData){
      setPage((prevPage) => prevPage + 1)
    }
  }

  useEffect(() => { 
    const throttleHandleScroll = throttle(handleScroll,  150)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll",handleScroll )
    }
  }, [hasMoreData, isLoading])

  return(
    <div className="mt-12 flex flex-col items-center justify-center">
      <ul className="max-w-96">
        {post.map((post)=> (
          <li 
          className="border border-white mb-5 rounded-xl p-4 space-y-3 shadow-lg shadow-sky-700 hover:bg-slate-800 cursor-pointer"
          key={Math.random() * 1000}>
            <h3 className="font-bold text-lg">{post.title}</h3>
            <p className="text-sm">{post.body}</p>
          </li>
        ))}
      </ul>
      {isLoading && <p>Carregando post...</p> }
    </div>
  )
}

function throttle(func: (n: void) => void, delay: number) {
  let lastCall = 0

  return function(...args: string[]){
    const now = new Date().getTime()
    if( now - lastCall > delay) return
    lastCall = now
    return func(...args)
  }
} 