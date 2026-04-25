import React, { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import EmptyState from "@/components/general/EmptyState";
import ErrorState from "@/components/general/ErrorState";
import LoadingState from "@/components/general/LoadingState";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import api from "@/api/api";
import { toast } from "sonner";

/**
 * fetchDepartments: calls the real API and maps the response into the shape
 * the UI expects ({ data: [...], meta: { total, page, limit, totalPages } }).
 *
 * - Shows a success toast on successful load and an error toast on failure.
 * - Throws on error so React Query can handle isError state.
 */
const fetchDepartments = async ({ page, limit, sortBy, sortOrder, search }) => {
  try {
    const params = {};
    if (page !== undefined && page !== null) params.page = page;
    if (limit !== undefined && limit !== null) params.limit = limit;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    if (search) params.search = search;

    // Call backend. The backend controller expects GET /departments (optionally with query params)
    const response = await api.get("/departments", { params });

    // Support either { success: true, data: [...] } or a direct array returned by the endpoint
    const list = response && response.success ? response.data : response;

    // Map metadata (server may not provide meta; fallback to sensible defaults)
    const total =
      response?.meta?.total ?? (Array.isArray(list) ? list.length : 0);
    const computedLimit =
      limit ||
      (response?.meta?.limit ?? (Array.isArray(list) ? list.length : 10));
    const totalPages =
      response?.meta?.totalPages ??
      Math.max(1, Math.ceil(total / computedLimit));

    // Notify user of success (kept lightweight)
    toast.success("Departments loaded");

    return {
      data: Array.isArray(list) ? list : [],
      meta: {
        total,
        page: page || 1,
        limit: computedLimit,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Fetch departments error:", error);
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Error fetching departments";
    toast.error(`Failed to load departments. ${message}`);
    // Re-throw so React Query can mark the query as errored
    throw error;
  }
};

const DepartmentList = () => {
  // Table State
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // TanStack Query Integration
  const { data, isLoading, isError, error, isPlaceholderData, refetch } =
    useQuery({
      queryKey: ["departments", page, limit, sortBy, sortOrder, search],
      queryFn: () =>
        fetchDepartments({ page, limit, sortBy, sortOrder, search }),
      placeholderData: keepPreviousData,
    });

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: () => <div className="text-left">Department Name</div>,
        cell: ({ row }) => <div className="text-left">{row.original.name}</div>,
      },
      {
        accessorKey: "code",
        header: () => <div className="text-center">Code</div>,
        cell: ({ row }) => (
          <div className="text-center">{row.original.code}</div>
        ),
      },
      {
        accessorKey: "staff",
        header: () => <div className="text-center">Staff</div>,
        cell: ({ row }) => (
          <div className="text-center">{row.original.staff}</div>
        ),
      },
      {
        accessorKey: "students",
        header: () => <div className="text-center">Students</div>,
        cell: ({ row }) => (
          <div className="text-center">{row.original.students}</div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: () => <div className="text-center">Date Created</div>,
        cell: ({ row }) => (
          <div className="text-center">
            {new Date(row.original.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        ),
      },
      {
        accessorKey: "id",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                  size="icon"
                >
                  <Icon icon="iwwa:option" width="40" height="40" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => navigate(row.original.id)}>
                  {/* <Link to={row.original.id}>View</Link>*/}
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(row.original.id + "/edit")}
                >
                  {/* <Link to={row.original.id + "/edit"}>Edit</Link>*/}
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(row.original.id + "/delete")}
                >
                  {/* <Link to={row.original.id + "/delete"}>Delete</Link>*/}
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  // Determine UI state
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
    <div className="p-5 rounded-xl border space-y-4">
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-full sm:max-w-sm">
          <Icon
            icon="iconamoon:search-thin"
            width="20"
            className="flex-shrink-0"
          />
          <Input
            placeholder="Search faculties..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset to page 1
            }}
            className="w-full"
            disabled={shouldDisableControls}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Sort by:
          </span>
          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={handleSortChange}
            disabled={shouldDisableControls}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select sorting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="departments-asc">
                Departments (Low to High)
              </SelectItem>
              <SelectItem value="departments-desc">
                Departments (High to Low)
              </SelectItem>
              <SelectItem value="createdAt-asc">Date (Oldest First)</SelectItem>
              <SelectItem value="createdAt-desc">
                Date (Newest First)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-0">
                  <LoadingState message="Loading faculties..." />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-0">
                  <ErrorState
                    title="Failed to load faculties"
                    description={
                      error?.message ||
                      "An error occurred while fetching the data. Please try again."
                    }
                    onButtonClick={() => refetch()}
                  />
                </TableCell>
              </TableRow>
            ) : isEmpty ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-0">
                  <EmptyState
                    // icon="tabler:folder-open"
                    title="No faculties found"
                    description={
                      search
                        ? `No results found for "${search}". Try adjusting your search.`
                        : "There are no faculties to display at the moment."
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
        <div className="text-xs sm:text-sm text-muted-foreground">
          {!isLoading && !isError && hasData && (
            <>
              Showing {data?.data?.length || 0} of {data?.meta?.total || 0}{" "}
              faculties
            </>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1 || isPlaceholderData || shouldDisableControls}
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
                disabled={isPlaceholderData || shouldDisableControls}
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
              setPage((prev) => Math.min(data?.meta?.totalPages || 1, prev + 1))
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
    </div>
  );
};

export default DepartmentList;
