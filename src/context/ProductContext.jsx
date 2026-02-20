import { createContext, useContext, useState, useEffect } from "react";
import initialProducts from "../data/products";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {

  const [products, setProducts] = useState([]);

  /* LOAD FROM LOCAL STORAGE */
  useEffect(() => {

    const savedProducts = localStorage.getItem("products");

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem(
        "products",
        JSON.stringify(initialProducts)
      );
    }

  }, []);

  /* SAVE TO LOCAL STORAGE */
  useEffect(() => {

    localStorage.setItem(
      "products",
      JSON.stringify(products)
    );

  }, [products]);

  /* ADD PRODUCT */
  const addProduct = (product) => {

    const newProduct = {
      ...product,
      id: Date.now(),
      rating: 4.0
    };

    setProducts((prev) => [
      ...prev,
      newProduct
    ]);
  };

  /* DELETE PRODUCT */
  const deleteProduct = (id) => {
    setProducts(
      products.filter(
        (product) => product.id !== id
      )
    );
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        deleteProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () =>
  useContext(ProductContext);