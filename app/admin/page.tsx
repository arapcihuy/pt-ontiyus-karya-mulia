"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Plus, LogOut, Upload, X, Edit } from "lucide-react"

type Product = { id: string; name: string; description: string; image?: string; category?: string; tags?: string[] }
type News = { id: string; title: string; excerpt?: string; image?: string; category?: string; date?: string; slug?: string }

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [authToken, setAuthToken] = useState("")
  const [loginError, setLoginError] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [productImagePreview, setProductImagePreview] = useState<string>("")
  const [newsImagePreview, setNewsImagePreview] = useState<string>("")
  const [productForm, setProductForm] = useState({ name: "", description: "", image: "", category: "", tags: "" })
  const [newsForm, setNewsForm] = useState({ title: "", excerpt: "", image: "", category: "" })
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null)

  const getAuthToken = () => authToken

  // Hash password menggunakan SHA-256 (sama dengan server)
  const hashPassword = async (password: string): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(password)
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashBase64 = btoa(String.fromCharCode(...hashArray))
    return hashBase64
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    if (!password) {
      setLoginError("Masukkan password")
      return
    }
    
    // Hash password menggunakan SHA-256
    const token = await hashPassword(password)
    
    try {
      // Test auth dengan POST dummy request
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ test: true })
      })
      
      // Jika 401, password salah
      if (res.status === 401) {
        setLoginError("Password salah")
        setPassword("")
        return
      }
      
      // Jika 400 (validation error), berarti auth ok tapi input invalid (expected)
      if (res.ok || res.status === 400) {
        setAuthToken(token)
        setIsAuthenticated(true)
        setPassword("")
        loadProducts()
        loadNews()
        return
      }
      
      setLoginError("Error validasi login")
    } catch (e) {
      setLoginError("Error koneksi: " + String(e))
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts()
      loadNews()
    }
  }, [isAuthenticated])

  useEffect(() => {
    console.log("Products state changed, current count:", products.length)
  }, [products])

  useEffect(() => {
    console.log("News state changed, current count:", news.length)
  }, [news])

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/products")
      const data = await res.json()
      console.log("Loaded products:", data.products?.length || 0)
      setProducts(data.products || [])
    } catch (e) {
      console.error("Error loading products:", e)
      setError("Gagal load produk")
    }
  }

  const loadNews = async () => {
    try {
      const res = await fetch("/api/news")
      const data = await res.json()
      console.log("Loaded news:", data.news?.length || 0)
      setNews(data.news || [])
    } catch (e) {
      console.error("Error loading news:", e)
      setError("Gagal load berita")
    }
  }

  const handleImageUpload = async (file: File, isProduct: boolean) => {
    if (!file) return
    
    // Preview lokal
    const reader = new FileReader()
    reader.onload = (e) => {
      const preview = e.target?.result as string
      if (isProduct) {
        setProductImagePreview(preview)
      } else {
        setNewsImagePreview(preview)
      }
    }
    reader.readAsDataURL(file)
    
    setUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Gagal upload gambar")
      } else {
        if (isProduct) {
          setProductForm({ ...productForm, image: data.imageUrl })
        } else {
          setNewsForm({ ...newsForm, image: data.imageUrl })
        }
      }
    } catch (e) {
      setError("Error upload: " + String(e))
    }
    setUploading(false)
  }

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    // Mode edit - update product
    if (editingProductId) {
      try {
        const tags = productForm.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        const res = await fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getAuthToken()}` },
          body: JSON.stringify({ 
            id: editingProductId,
            name: productForm.name, 
            description: productForm.description, 
            image: productForm.image || undefined, 
            category: productForm.category || undefined, 
            tags 
          }),
        })
        const data = await res.json()
        
        if (!res.ok) {
          setError(data.error || "Gagal mengupdate produk")
        } else {
          setProductForm({ name: "", description: "", image: "", category: "", tags: "" })
          setProductImagePreview("")
          setEditingProductId(null)
          await loadProducts()
        }
      } catch (e) {
        setError("Error: " + String(e))
      }
      setLoading(false)
      return
    }
    
    // Mode tambah - add new product
    console.log("=== START ADD PRODUCT ===")
    console.log("Current products in state:", products.length)
    
    const tags = productForm.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
    try {
      console.log("Adding product:", productForm.name)
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getAuthToken()}` },
        body: JSON.stringify({ name: productForm.name, description: productForm.description, image: productForm.image || undefined, category: productForm.category || undefined, tags }),
      })
      const data = await res.json()
      console.log("Add product response:", data)
      
      if (!res.ok) {
        setError(data.error || "Gagal menambah produk")
      } else {
        console.log("Product added successfully")
        console.log("Products before update:", products.length)
        
        // Reset form dulu
        setProductForm({ name: "", description: "", image: "", category: "", tags: "" })
        setProductImagePreview("")
        
        // Reload semua produk dari server untuk memastikan sinkron
        await loadProducts()
        
        console.log("Products reloaded from server")
      }
    } catch (e) {
      console.error("Add product error:", e)
      setError("Error: " + String(e))
    }
    console.log("=== END ADD PRODUCT ===")
    setLoading(false)
  }

  const deleteProduct = async (id: string) => {
    if (!confirm("Hapus produk ini?")) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getAuthToken()}` } })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Gagal menghapus produk")
      } else {
        loadProducts()
      }
    } catch (e) {
      setError("Error: " + String(e))
    }
    setLoading(false)
  }

  const editProduct = (product: Product) => {
    setEditingProductId(product.id)
    setProductForm({
      name: product.name,
      description: product.description,
      image: product.image || "",
      category: product.category || "",
      tags: product.tags?.join(", ") || "",
    })
    setProductImagePreview(product.image || "")
    // Scroll ke form
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const cancelEditProduct = () => {
    setEditingProductId(null)
    setProductForm({ name: "", description: "", image: "", category: "", tags: "" })
    setProductImagePreview("")
  }

  const addNews = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    // Mode edit - update news
    if (editingNewsId) {
      try {
        const res = await fetch("/api/news", {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getAuthToken()}` },
          body: JSON.stringify({ 
            id: editingNewsId,
            title: newsForm.title, 
            excerpt: newsForm.excerpt || undefined, 
            image: newsForm.image || undefined, 
            category: newsForm.category || undefined 
          }),
        })
        const data = await res.json()
        
        if (!res.ok) {
          setError(data.error || "Gagal mengupdate berita")
        } else {
          setNewsForm({ title: "", excerpt: "", image: "", category: "" })
          setNewsImagePreview("")
          setEditingNewsId(null)
          await loadNews()
        }
      } catch (e) {
        setError("Error: " + String(e))
      }
      setLoading(false)
      return
    }
    
    // Mode tambah - add new news
    try {
      console.log("Adding news:", newsForm.title)
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getAuthToken()}` },
        body: JSON.stringify({ title: newsForm.title, excerpt: newsForm.excerpt || undefined, image: newsForm.image || undefined, category: newsForm.category || undefined }),
      })
      const data = await res.json()
      console.log("Add news response:", data)
      if (!res.ok) {
        setError(data.error || "Gagal menambah berita")
      } else {
        console.log("News added successfully")
        
        // Reset form dulu
        setNewsForm({ title: "", excerpt: "", image: "", category: "" })
        setNewsImagePreview("")
        
        // Reload semua berita dari server untuk memastikan sinkron
        await loadNews()
        
        console.log("News reloaded from server")
      }
    } catch (e) {
      console.error("Add news error:", e)
      setError("Error: " + String(e))
    }
    setLoading(false)
  }

  const deleteNews = async (id: string) => {
    if (!confirm("Hapus berita ini?")) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/news?id=${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getAuthToken()}` } })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Gagal menghapus berita")
      } else {
        loadNews()
      }
    } catch (e) {
      setError("Error: " + String(e))
    }
    setLoading(false)
  }

  const editNews = (item: News) => {
    setEditingNewsId(item.id)
    setNewsForm({
      title: item.title,
      excerpt: item.excerpt || "",
      image: item.image || "",
      category: item.category || "",
    })
    setNewsImagePreview(item.image || "")
    // Scroll ke form
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const cancelEditNews = () => {
    setEditingNewsId(null)
    setNewsForm({ title: "", excerpt: "", image: "", category: "" })
    setNewsImagePreview("")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-secondary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Masukkan password untuk akses admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password" autoFocus />
              </div>
              {loginError && <Alert variant="destructive"><AlertDescription>{loginError}</AlertDescription></Alert>}
              <Button type="submit" className="w-full">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/30 p-4 lg:p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Kelola produk dan berita</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => { setIsAuthenticated(false); setPassword(""); setAuthToken(""); setProducts([]); setNews([]) }}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {error && <Alert variant="destructive" className="mb-6"><AlertDescription>{error}</AlertDescription></Alert>}

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Produk</TabsTrigger>
            <TabsTrigger value="news">Berita</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {editingProductId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {editingProductId ? "Edit Produk" : "Tambah Produk Baru"}
                </CardTitle>
                <CardDescription>Category: <strong>implan</strong> atau <strong>prostetik</strong></CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={addProduct} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nama Produk *</label>
                    <Input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Deskripsi *</label>
                    <Textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-3 block">Upload Gambar</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className="col-span-1 border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center hover:border-primary/50 hover:bg-primary/5 transition cursor-pointer relative"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault()
                          const file = e.dataTransfer.files?.[0]
                          if (file) handleImageUpload(file, true)
                        }}
                        onClick={() => document.getElementById("product-file-input")?.click()}
                      >
                        <input
                          id="product-file-input"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(file, true)
                          }}
                          className="hidden"
                          title="Pilih gambar untuk produk"
                        />
                        <div className="space-y-2">
                          <div className="text-3xl">📁</div>
                          <p className="text-sm font-medium">Drag & drop di sini</p>
                          <p className="text-xs text-muted-foreground">atau klik</p>
                          <p className="text-xs text-muted-foreground">Max 5MB</p>
                        </div>
                        {uploading && <div className="absolute inset-0 bg-black/10 rounded-lg flex items-center justify-center"><span className="text-sm">Uploading...</span></div>}
                      </div>

                      <div className="col-span-1 border border-muted-foreground/20 rounded-lg p-4 flex flex-col items-center justify-center bg-muted/30 min-h-40">
                        {productImagePreview ? (
                          <div className="relative w-full h-32">
                            <img src={productImagePreview} alt="preview" className="w-full h-full object-contain rounded" />
                            {productForm.image && <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded">✓</div>}
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground">
                            <div className="text-3xl mb-2">🖼️</div>
                            <p className="text-sm">Preview</p>
                          </div>
                        )}
                        {productImagePreview && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => { setProductForm({ ...productForm, image: "" }); setProductImagePreview("") }} className="mt-2 text-xs">
                            <X className="w-3 h-3 mr-1" />
                            Hapus
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Input value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} placeholder="implan / prostetik" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tags (pisah koma)</label>
                    <Input value={productForm.tags} onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })} placeholder="hospital, orthopedic" />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                      {loading ? (editingProductId ? "Mengupdate..." : "Menambah...") : (editingProductId ? "Update Produk" : "Tambah Produk")}
                    </Button>
                    {editingProductId && (
                      <Button type="button" variant="outline" onClick={cancelEditProduct}>Batal</Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Daftar Produk ({products.length})</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-start justify-between gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {product.category && <Badge variant="outline">{product.category}</Badge>}
                          {product.tags?.map((tag) => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                        </div>
                      </div>
                      {product.image && <img src={product.image} alt={product.name} className="w-16 h-16 object-contain border rounded" />}
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => editProduct(product)} disabled={loading}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => deleteProduct(product.id)} disabled={loading}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && <p className="text-center text-muted-foreground py-8">Belum ada produk</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {editingNewsId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {editingNewsId ? "Edit Berita" : "Tambah Berita Baru"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={addNews} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Judul Berita *</label>
                    <Input value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Ringkasan</label>
                    <Textarea value={newsForm.excerpt} onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-3 block">Upload Gambar</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className="col-span-1 border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center hover:border-primary/50 hover:bg-primary/5 transition cursor-pointer relative"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault()
                          const file = e.dataTransfer.files?.[0]
                          if (file) handleImageUpload(file, false)
                        }}
                        onClick={() => document.getElementById("news-file-input")?.click()}
                      >
                        <input
                          id="news-file-input"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(file, false)
                          }}
                          className="hidden"
                          title="Pilih gambar untuk berita"
                        />
                        <div className="space-y-2">
                          <div className="text-3xl">📁</div>
                          <p className="text-sm font-medium">Drag & drop di sini</p>
                          <p className="text-xs text-muted-foreground">atau klik</p>
                          <p className="text-xs text-muted-foreground">Max 5MB</p>
                        </div>
                        {uploading && <div className="absolute inset-0 bg-black/10 rounded-lg flex items-center justify-center"><span className="text-sm">Uploading...</span></div>}
                      </div>

                      <div className="col-span-1 border border-muted-foreground/20 rounded-lg p-4 flex flex-col items-center justify-center bg-muted/30 min-h-40">
                        {newsImagePreview ? (
                          <div className="relative w-full h-32">
                            <img src={newsImagePreview} alt="preview" className="w-full h-full object-cover rounded" />
                            {newsForm.image && <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded">✓</div>}
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground">
                            <div className="text-3xl mb-2">🖼️</div>
                            <p className="text-sm">Preview</p>
                          </div>
                        )}
                        {newsImagePreview && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => { setNewsForm({ ...newsForm, image: "" }); setNewsImagePreview("") }} className="mt-2 text-xs">
                            <X className="w-3 h-3 mr-1" />
                            Hapus
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Input value={newsForm.category} onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })} placeholder="berita, artikel" />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                      {loading ? (editingNewsId ? "Mengupdate..." : "Menambah...") : (editingNewsId ? "Update Berita" : "Tambah Berita")}
                    </Button>
                    {editingNewsId && (
                      <Button type="button" variant="outline" onClick={cancelEditNews}>Batal</Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Daftar Berita ({news.length})</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {news.map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.excerpt}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {item.category && <Badge variant="outline">{item.category}</Badge>}
                          {item.date && <Badge variant="secondary" className="text-xs">{new Date(item.date).toLocaleDateString("id-ID")}</Badge>}
                        </div>
                      </div>
                      {item.image && <img src={item.image} alt={item.title} className="w-16 h-16 object-cover border rounded" />}
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => editNews(item)} disabled={loading}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => deleteNews(item.id)} disabled={loading}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {news.length === 0 && <p className="text-center text-muted-foreground py-8">Belum ada berita</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
