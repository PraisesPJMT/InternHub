import { useState } from "react";
import { Outlet } from "react-router";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import api from "@/api/api";

import Button from "@/components/ui/button";
import AppLink from "@/components/ui/AppLink";
import ErrorState from "@/components/general/ErrorState";
import EmptyState from "@/components/general/EmptyState";
import LoadingState from "@/components/general/LoadingState";
import AdminInternshipCard from "@/components/ui/internship/AdminInternshipCard";

const AdminInternships = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error, isPlaceholderData, refetch } =
    useQuery({
      queryKey: ["internships", page, limit, sortBy, sortOrder, search],
      queryFn: async () => {
        const params = {};
        if (page !== undefined && page !== null) params.page = page;
        if (limit !== undefined && limit !== null) params.limit = limit;
        if (sortBy) params.sortBy = sortBy;
        if (sortOrder) params.sortOrder = sortOrder;
        if (search) params.search = search;

        // Call backend. The backend controller expects GET /departments (optionally with query params)
        const response = await api.get(`/internships`, {
          params,
        });

        const payload =
          response && response.success
            ? response
            : (response?.data ?? response);
        const list = Array.isArray(payload?.data) ? payload.data : [];
        const pagination = payload?.pagination ?? {};

        const total = Number.isFinite(pagination.total)
          ? pagination.total
          : list.length;
        const computedLimit =
          Number.isFinite(pagination.limit) && pagination.limit > 0
            ? pagination.limit
            : limit || 10;
        const totalPages = Number.isFinite(pagination.totalPages)
          ? pagination.totalPages
          : total === 0
            ? 0
            : Math.ceil(total / computedLimit);
        const currentPage =
          Number.isFinite(pagination.page) && pagination.page > 0
            ? pagination.page
            : page || 1;

        // Notify user of success (kept lightweight)
        // toast.success("Departments loaded");

        return {
          data: list,
          meta: {
            total,
            page: currentPage,
            limit: computedLimit,
            totalPages,
          },
        };
      },
      placeholderData: keepPreviousData,
    });

  const hasData = data?.data && data.data.length > 0;
  const isEmpty = !isLoading && !isError && !hasData;
  const shouldDisableControls = isLoading || isError || isEmpty;

  // Handle sort change
  const handleSortChange = (value) => {
    const [field, order] = value.split("-");
    setSortBy(field);
    setSortOrder(order);
    setPage(1); // Reset to first page when sorting changes
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const totalPages = data?.meta?.totalPages || 1;
    const current = page;
    const pages = [];

    if (totalPages <= 5) {
      // Show all pages if 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current > 3) {
        pages.push("...");
      }

      // Show pages around current page
      for (
        let i = Math.max(2, current - 1);
        i <= Math.min(totalPages - 1, current + 1);
        i++
      ) {
        pages.push(i);
      }

      if (current < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <>
      <div className="flex flex-col gap-5 p-1 overflow-hidden">
        <section className="p-5 border-b rounded-t-xl flex items-center justify-between gap-2">
          <h2 className="text-xl md:text-2xl font-bold">Internships</h2>

          <AppLink to="new">Create</AppLink>
        </section>

        <section className="p-5 border space-y-4 rounded-lg overflow-y-auto">
          <h2 className="text-sm md:text-sm font-bold">Internships</h2>

          {/* Search and Sort Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 max-w-full sm:max-w-sm">
              <Icon
                icon="iconamoon:search-thin"
                width="20"
                className="flex-shrink-0"
              />
              <Input
                placeholder="Search internships..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1); // Reset to page 1
                }}
                className="w-full"
                // disabled={shouldDisableControls}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Sort by:
              </span>
              <Select
                value={`${sortBy}-${sortOrder}`}
                onValueChange={handleSortChange}
                // disabled={shouldDisableControls}
              >
                <SelectTrigger className="w-full sm:w-50">
                  <SelectValue placeholder="Select sorting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                  <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                  <SelectItem value="code-asc">Code (A-Z)</SelectItem>
                  <SelectItem value="code-desc">Code (Z-A)</SelectItem>
                  <SelectItem value="duration-asc">
                    Duration (Short to Long)
                  </SelectItem>
                  <SelectItem value="duration-desc">
                    Duration (Long to Short)
                  </SelectItem>
                  <SelectItem value="createdAt-asc">
                    Date (Oldest First)
                  </SelectItem>
                  <SelectItem value="createdAt-desc">
                    Date (Newest First)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!isLoading && !isError && (
            <>
              {isEmpty ? (
                <EmptyState
                  // icon="tabler:folder-open"
                  title="No internships found"
                  description={
                    search
                      ? `No results found for "${search}". Try adjusting your search.`
                      : "There are no internships to display at the moment."
                  }
                />
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 rounded-lg">
                    {(data?.data ?? []).map((internship) => (
                      <AdminInternshipCard
                        key={internship.id}
                        internship={internship}
                      />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {!isLoading && !isError && hasData && (
                        <>
                          Showing {data?.data?.length || 0} of{" "}
                          {data?.meta?.total || 0} internships
                        </>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        disabled={
                          page === 1 ||
                          isPlaceholderData ||
                          shouldDisableControls
                        }
                        className="text-xs sm:text-sm"
                      >
                        <Icon
                          icon="iconamoon:arrow-left-2-light"
                          className="mr-1 w-4 h-4"
                        />
                        <span className="hidden xs:inline">Previous</span>
                        <span className="xs:hidden">Prev</span>
                      </Button>

                      {getPageNumbers().map((pageNum, index) =>
                        pageNum === "..." ? (
                          <span
                            key={`ellipsis-${index}`}
                            className="px-2 text-muted-foreground"
                          >
                            ...
                          </span>
                        ) : (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPage(pageNum)}
                            disabled={
                              isPlaceholderData || shouldDisableControls
                            }
                            className="min-w-[32px] sm:min-w-[40px] text-xs sm:text-sm"
                          >
                            {pageNum}
                          </Button>
                        ),
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPage((prev) =>
                            Math.min(data?.meta?.totalPages || 1, prev + 1),
                          )
                        }
                        disabled={
                          page >= (data?.meta?.totalPages || 1) ||
                          isPlaceholderData ||
                          shouldDisableControls
                        }
                        className="text-xs sm:text-sm"
                      >
                        <span className="hidden xs:inline">Next</span>
                        <span className="xs:hidden">Next</span>
                        <Icon
                          icon="iconamoon:arrow-right-2-light"
                          className="ml-1 w-4 h-4"
                        />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {isLoading && <LoadingState />}

          {isError && (
            <ErrorState
              title="Internship Fetch Error"
              description={
                error?.message ||
                "An error occured while fetching internships. Please try again later."
              }
              showButton
              onButtonClick={refetch}
            />
          )}
        </section>
      </div>
      <Outlet />
    </>
  );
};

export default AdminInternships;
