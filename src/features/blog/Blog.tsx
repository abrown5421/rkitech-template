import React, { useState, useMemo } from "react";
import { Button, Container, Icon, Select, Text, PlaceholderImage} from "rkitech-components";
import type { BlogProps } from "./blogTypes";
import { useAppSelector } from "../../app/hooks";
import { useGetTheme } from "../../hooks/useGetTheme";
import type { BlogPost } from "../../cli/src/features/Blog/types/blogTypes";
import { useNavigationHook } from "../../hooks/useNavigationHook";
import { formatDate } from "../../utils/formatDate";


const Blog: React.FC<BlogProps> = () => {
  const navigate = useNavigationHook();
  const application = useAppSelector((state) => state.application);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const themeBlack = useGetTheme("black");
  const themeWhite = useGetTheme("white");
  const themePrimary = useGetTheme("primary");

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    setCurrentPage(1); 
  };

  const filteredAndSortedPosts = useMemo(() => {
    let posts = [...application.blog.blogPosts];

    if (selectedCategory !== "all") {
      posts = posts.filter(post => post.postCategory === selectedCategory);
    }

    switch (sortOption) {
      case "newest":
        posts.sort((a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime());
        break;
      case "oldest":
        posts.sort((a, b) => new Date(a.postDate).getTime() - new Date(b.postDate).getTime());
        break;
      case "a-z":
        posts.sort((a, b) => a.postTitle.localeCompare(b.postTitle));
        break;
      case "z-a":
        posts.sort((a, b) => b.postTitle.localeCompare(a.postTitle));
        break;
      default:
        break;
    }

    return posts;
  }, [application.blog.blogPosts, selectedCategory, sortOption]);

  const totalPosts = filteredAndSortedPosts.length;
  const totalPages = Math.ceil(totalPosts / application.blog.postsPerPage);
  const startIndex = (currentPage - 1) * application.blog.postsPerPage;
  const endIndex = startIndex + application.blog.postsPerPage;
  const currentPosts = filteredAndSortedPosts.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const getGridClasses = () => {
    const postsPerRow = application.blog.postsPerRow;
    
    let gridCols = "grid-cols-1";
    
    if (postsPerRow === 2) {
      gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-2";
    } else if (postsPerRow === 3) {
      gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    } else if (postsPerRow === 4) {
      gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
    } else if (postsPerRow >= 5) {
      gridCols = `grid-cols-1 md:grid-cols-2 lg:grid-cols-${postsPerRow}`;
    }
    
    return gridCols;
  };

  const handlePostClick = (postId: string) => {
    const blogPostPage = application.pages.find((p) => p.pageName === 'BlogPost')
    
    if (!blogPostPage) return;

    const pageWithPostId = {
      ...blogPostPage,
      pagePath: blogPostPage.pagePath.replace(":postID", postId)
    };

    navigate(pageWithPostId)()
  }

  return (
    <Container tailwindClasses="flex-col w-full md:w-4/5 mx-auto h-full min-h-[calc(100vh-50px)] p-5">
      <Text 
        text={application.blog.blogTitle} 
        tailwindClasses={`text-3xl my-5 font-mono text-${themeBlack}`} 
      />
      
      <Container tailwindClasses="flex-row flex-wrap items-center justify-between gap-4">
        {application.blog.postCategoryFilter && (
          <Container tailwindClasses="flex-col flex-1 min-w-fit">
            <Container tailwindClasses="flex-row gap-4 flex-wrap">
              <Button 
                tailwindClasses={`border-2 py-1 px-4 rounded-xl cursor-pointer transition-colors ${
                  selectedCategory === "all" 
                    ? `bg-${themePrimary} text-${themeWhite} border-${themePrimary}`
                    : `bg-transparent hover:text-${themeWhite} text-${themeBlack} hover:bg-${themePrimary} border-${themePrimary}`
                }`}
                onClick={() => handleCategoryFilter("all")}
              >
                All Categories
              </Button>
              {application.blog.blogCategories.map((cat) => (
                <Button 
                  key={cat}
                  tailwindClasses={`border-2 py-1 px-4 rounded-xl cursor-pointer transition-colors ${
                    selectedCategory === cat 
                      ? `bg-${themePrimary} text-${themeWhite} border-${themePrimary}`
                      : `bg-transparent hover:text-${themeWhite} text-${themeBlack} hover:bg-${themePrimary} border-${themePrimary}`
                  }`}
                  onClick={() => handleCategoryFilter(cat)}
                >
                  {cat}
                </Button>
              ))}
            </Container>
          </Container>
        )}
        
        {application.blog.postSorter && (
          <Container tailwindClasses="flex-col items-end">
            <Select value={sortOption} onChange={handleSortChange}>
              <option value="newest">Newest - Oldest</option>
              <option value="oldest">Oldest - Newest</option>
              <option value="a-z">A - Z</option>
              <option value="z-a">Z - A</option>
            </Select>
          </Container>
        )}
      </Container>

      <Container tailwindClasses="flex-row items-center justify-between ml-1 my-4">
        <Text 
          text={`${filteredAndSortedPosts.length} post${filteredAndSortedPosts.length !== 1 ? 's' : ''} found${
            selectedCategory !== "all" ? ` in "${selectedCategory}"` : ""
          }`}
          tailwindClasses={`text-sm text-gray-500`}
        />
        {filteredAndSortedPosts.length > 0 && totalPages > 1 && (
          <Text 
            text={`Page ${currentPage} of ${totalPages}`}
            tailwindClasses="text-sm text-gray-500"
          />
        )}
      </Container>

      <div className={`grid ${getGridClasses()} gap-6 mb-8`}>
        {currentPosts.map((post: BlogPost) => (
          <Container 
            key={post.postID}
            tailwindClasses="flex-col w-full min-h-[450px] shadow-xl relative bg-white rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
            onClick={() => handlePostClick(post.postID)}
          >
            <div className="relative">
              <PlaceholderImage 
                width="100%" 
                height="150px" 
                src={post.postImage.src}
                cellSize={post.postImage.cellSize}
                variance={post.postImage.variance}
                xColors={post.postImage.xColors}
                yColors={post.postImage.yColors}
              />
              <Container 
                tailwindClasses={`absolute top-2 right-2 py-1 px-3 rounded-xl bg-${themeWhite} shadow-md`}
              >
                <Text 
                  text={post.postCategory} 
                  tailwindClasses={`text-sm font-medium text-${themePrimary}`}
                />
              </Container>
            </div>
            
            <Container tailwindClasses="flex-col p-4 flex-grow">
              <Text 
                text={post.postTitle} 
                tailwindClasses={`text-xl mb-3 font-mono text-${themeBlack} truncate`} 
              />
              <Text 
                text={post.postExcerpt} 
                tailwindClasses={`mt-4 text-gray-500 leading-relaxed line-clamp-3 flex-grow`} 
              />
              
              <div className="h-px bg-gray-300 my-4"></div>
              
              <Container tailwindClasses="flex-row text-sm text-gray-500 justify-between items-center">
                <Container tailwindClasses="flex-col">
                  <Text text={post.postAuthor} tailwindClasses={`font-medium text-${themePrimary}`} />
                </Container>
                <Container tailwindClasses="flex-col">
                  <Text text={formatDate(post.postDate)} tailwindClasses="text-right" />
                </Container>
              </Container>
            </Container>
          </Container>
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="flex items-center justify-center px-4 py-3 sm:px-6" aria-label="Pagination">
          
          <div className="flex flex-1 justify-center">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              tailwindClasses={`mr-3 ${currentPage === 1 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <Icon iconName="SkipBack" color={currentPage === 1 ? "gray" : "amber"} intensity={currentPage === 1 ? 300 : 500} size={15} />
            </Button>
            
            <Container tailwindClasses="flex-row">
              {getPageNumbers().map((pageNum) => (
                <Button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  tailwindClasses={`relative cursor-pointer inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    pageNum === currentPage
                      ? `z-10 bg-${themePrimary} border-1 border-${themePrimary} text-white`
                      : `border-1 border-${themePrimary} text-gray-900`
                  }`}
                >
                  {pageNum}
                </Button>
              ))}
            </Container>
            
            <Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              tailwindClasses={`ml-3 ${currentPage === totalPages ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <Icon iconName="SkipForward" color={currentPage === totalPages ? "gray" : "amber"} intensity={currentPage === totalPages ? 300 : 500} size={15} />
            </Button>
          </div>
        </nav>
      )}

      {currentPosts.length === 0 && (
        <Container tailwindClasses="flex-col flex-grow items-center justify-center pb-12">
          <Text 
            text="No posts found" 
            tailwindClasses={`text-xl text-gray-500 mb-2`} 
          />
          <Text 
            text={
              filteredAndSortedPosts.length === 0 
                ? selectedCategory !== "all" 
                  ? `No posts found in "${selectedCategory}". Try selecting a different category or "All Categories".`
                  : "No posts available at this time. Please check back later for new content."
                : "No posts found on this page. This might be due to pagination limits."
            }
            tailwindClasses="text-gray-400 text-center max-w-md" 
          />
          {selectedCategory !== "all" && (
            <Button 
              tailwindClasses={`mt-4 border-2 py-2 px-6 rounded-xl cursor-pointer bg-transparent hover:text-${themeWhite} text-${themePrimary} hover:bg-${themePrimary} border-${themePrimary} transition-colors`}
              onClick={() => handleCategoryFilter("all")}
            >
              Show All Categories
            </Button>
          )}
        </Container>
      )}
    </Container>
  );
};

export default Blog;