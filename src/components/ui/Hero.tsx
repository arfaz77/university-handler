"use client";
import { University } from "@/services/universityService";
import Header from "../header";
import UniversityCard from "../UniversityCard";
import { useEffect, useState, useCallback } from "react";
import { getUniversities, PaginatedResponse } from "@/services/universityService";

const UniversityPortal = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });

  const fetchUniversities = useCallback(async () => {
    try {
      setLoading(true);
      const response: PaginatedResponse<University> = await getUniversities({
        page,
        limit,
        search,
      });
      setUniversities(response.data);
      setPagination({
        total: response.pagination.total,
        pages: response.pagination.pages,
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset page to 1 when searching
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800">Top Universities in India</h1>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search universities..."
              className="flex-1 p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </form>

        {/* Data Display */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : universities.length === 0 ? (
          <p>No universities found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {universities.map((university) => (
                <UniversityCard key={university._id} university={university} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="flex gap-2">
                  {page > 1 && (
                    <button
                      onClick={() => setPage(page - 1)}
                      className="px-3 py-1 border rounded"
                    >
                      Previous
                    </button>
                  )}

                  {Array.from({ length: pagination.pages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`px-3 py-1 border rounded ${
                        page === i + 1 ? "bg-blue-500 text-white" : ""
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  {page < pagination.pages && (
                    <button
                      onClick={() => setPage(page + 1)}
                      className="px-3 py-1 border rounded"
                    >
                      Next
                    </button>
                  )}
                </nav>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default UniversityPortal;
