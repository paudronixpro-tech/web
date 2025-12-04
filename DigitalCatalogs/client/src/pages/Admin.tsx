import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductUploadForm } from "@/components/ProductUploadForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Package, BarChart3, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import generated images for defaults
import netflixImg from "@assets/generated_images/netflix_logo_3d_glass_icon_style.png";
import spotifyImg from "@assets/generated_images/spotify_logo_3d_glass_icon_style.png";
import disneyImg from "@assets/generated_images/disney_plus_logo_3d_glass_icon_style.png";
import primeImg from "@assets/generated_images/amazon_prime_video_logo_3d_glass_icon_style.png";

// Initial Data
const initialProducts = [
  {
    id: 1,
    title: "Netflix Premium",
    price: "35",
    category: "Streaming",
    color: "#E50914",
    image: netflixImg,
    features: ["4 Pantallas Ultra HD", "Sin anuncios", "Descargas offline"],
    whatsapp: "37871216",
    popular: true
  },
  {
    id: 2,
    title: "Spotify Premium",
    price: "25",
    category: "Música",
    color: "#1DB954",
    image: spotifyImg,
    features: ["Música sin límites", "Sin anuncios", "Modo offline"],
    whatsapp: "37871216",
    popular: false
  },
  {
    id: 3,
    title: "Disney+ / Star+",
    price: "30",
    category: "Streaming",
    color: "#113CCF",
    image: disneyImg,
    features: ["Disney, Pixar, Marvel", "Deportes en vivo", "4 Pantallas UHD"],
    whatsapp: "37871216",
    popular: false
  },
  {
    id: 4,
    title: "Amazon Prime",
    price: "20",
    category: "Streaming",
    color: "#00A8E1",
    image: primeImg,
    features: ["Prime Video", "Envíos gratis (USA)", "Prime Gaming"],
    whatsapp: "37871216",
    popular: false
  }
];

export default function Admin() {
  // Try to load from localStorage first, else use initial
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : initialProducts;
  });
  
  const [activeTab, setActiveTab] = useState("all");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const { toast } = useToast();

  // Save to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const handleAddProduct = (newProduct: any) => {
    setProducts([...products, newProduct]);
  };

  const handleUpdateProduct = (updatedProduct: any) => {
    setProducts(products.map((p: any) => p.id === updatedProduct.id ? updatedProduct : p));
    setEditingProduct(null);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      setProducts(products.filter((p: any) => p.id !== id));
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado del catálogo.",
        variant: "destructive"
      });
    }
  };

  const startEdit = (product: any) => {
    setEditingProduct(product);
  };

  // Filter products based on active tab
  const filteredProducts = activeTab === "all" 
    ? products 
    : products.filter((p: any) => p.category === activeTab);

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(products.map((p: any) => p.category))) as string[]];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold font-heading text-foreground">Panel de Administración</h1>
            <p className="text-muted-foreground mt-2">Gestiona tu catálogo de productos digitales</p>
          </div>
          <ProductUploadForm 
            onAddProduct={handleAddProduct} 
            existingProduct={editingProduct} // Pass editing product if any
            onUpdateProduct={handleUpdateProduct}
            categories={categories}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-white shadow-sm border-border/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Productos</p>
                <h3 className="text-2xl font-bold">{products.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border-border/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-full">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Categorías Activas</p>
                <h3 className="text-2xl font-bold">{categories.length - 1}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-border/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clientes Activos</p>
                <h3 className="text-2xl font-bold">128</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Management */}
        <Card className="bg-white shadow-lg border-border/50">
          <CardHeader className="border-b border-border/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <CardTitle>Inventario</CardTitle>
              
              <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
                <TabsList className="flex flex-wrap h-auto gap-1 bg-gray-100 p-1">
                  {categories.map(cat => (
                     <TabsTrigger key={cat} value={cat} className="capitalize">{cat === 'all' ? 'Todos' : cat}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">WhatsApp</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product: any) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden border border-gray-200 bg-gray-100">
                            <img 
                              className="h-10 w-10 object-cover" 
                              src={product.image} 
                              alt="" 
                              onError={(e) => {
                                e.currentTarget.src = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop";
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.title}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: product.color }}></span>
                              Color Tag
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Q{product.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.whatsapp || "37871216"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-blue-600 hover:bg-blue-50"
                          onClick={() => startEdit(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-600 hover:bg-red-50" 
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No hay productos en esta categoría.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
