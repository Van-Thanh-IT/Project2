import ProductCard from "../../components/product/ProductCard";
function Home() {
  return (
    <div>
      <h1 className="bg-info">🏠 Home Page</h1>
      <p>Chào mừng bạn đến trang chủ!</p>
      <ProductCard/>
      <ProductCard/>
      <ProductCard/>
      <ProductCard/>
      
    </div>
  );
}

export default Home;
