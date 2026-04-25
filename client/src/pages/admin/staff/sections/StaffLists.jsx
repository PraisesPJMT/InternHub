import React, { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/api/api";
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

// Fetch staff from real API and perform client-side search/sort/pagination
const fetchStaff = async ({ page, limit, sortBy, sortOrder, search }) => {
  try {
    // Call backend supervisors endpoint
    // The API client unwraps response.data so this resolves to the server payload or data
    const res = await api.get("/supervisors");

    // Normalize possible shapes:
    // - API may return { success, data: [...] }
    // - api client may have unwrapped to data array directly
    const payload = res && res.success ? res.data : (res ?? []);
    const list = Array.isArray(payload) ? payload : (payload?.data ?? []);

    // Client-side search (name/email)
    let items = Array.isArray(list) ? list : [];

    if (search) {
      const q = search.toString().toLowerCase();
      items = items.filter((s) => {
        const name = `${s.firstName ?? ""} ${s.lastName ?? ""}`.toLowerCase();
        const email = (s.email ?? "").toLowerCase();
        return name.includes(q) || email.includes(q);
      });
    }

    // Client-side sort
    if (sortBy) {
      items.sort((a, b) => {
        let va = a?.[sortBy];
        let vb = b?.[sortBy];

        if (sortBy === "createdAt") {
          va = va ? new Date(va) : new Date(0);
          vb = vb ? new Date(vb) : new Date(0);
        } else {
          va =
            va !== undefined && va !== null ? va.toString().toLowerCase() : "";
          vb =
            vb !== undefined && vb !== null ? vb.toString().toLowerCase() : "";
        }

        if (va < vb) return sortOrder === "asc" ? -1 : 1;
        if (va > vb) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    // Pagination (client-side)
    const total = items.length;
    const curPage = page || 1;
    const perPage = limit || 5;
    const start = (curPage - 1) * perPage;
    const paged = items.slice(start, start + perPage);

    return {
      data: paged,
      meta: {
        total,
        page: curPage,
        limit: perPage,
        totalPages: Math.max(1, Math.ceil(total / perPage)),
      },
    };
  } catch (err) {
    const message =
      err?.response?.data?.message || err?.message || "Failed to fetch staff";
    const error = new Error(message);
    error.response = err?.response;
    throw error;
  }
};

const StaffList = () => {
  // Table State
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // TanStack Query Integration
  const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
    queryKey: ["staff", page, limit, sortBy, sortOrder, search],
    queryFn: () => fetchStaff({ page, limit, sortBy, sortOrder, search }),
    keepPreviousData: true,
    onError: (err) => {
      const message =
        err?.response?.data?.message || err?.message || "Error fetching staff";
      toast.error(message);
    },
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "firstName",
        header: () => <div className="text-left">Staff Name</div>,
        cell: ({ row }) => (
          <div className="text-left">
            {row.original.firstName} {row.original.lastName}
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: () => <div className="text-center">Email</div>,
        cell: ({ row }) => (
          <div className="text-center">{row.original.email}</div>
        ),
      },
      {
        accessorKey: "interns",
        header: () => <div className="text-center">Interns</div>,
        cell: ({ row }) => (
          <div className="text-center">{row.original.interns}</div>
        ),
      },
      {
        accessorKey: "isAdmin",
        header: () => <div className="text-center">Role</div>,
        cell: ({ row }) => (
          <div className="text-center">
            {row.original.isAdmin ? "Admin" : "Supervisor"}
          </div>
        ),
      },
      {
        accessorKey: "isActive",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => (
          <div className="text-center">
            {row.original.isActive ? "Active" : "Inactive"}
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
                {row.original.isActive ? (
                  <DropdownMenuItem
                    onClick={() => navigate(row.original.id + "/deactivate")}
                  >
                    {/* <Link to={row.original.id + "/deactivate"}>Deactivate</Link>*/}
                    Deactivate
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => navigate(row.original.id + "/activate")}
                  >
                    {/* <Link to={row.original.id + "/activate"}>Activate</Link>*/}
                    Activate
                  </DropdownMenuItem>
                )}
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
            disabled={page === 1 || isFetching || shouldDisableControls}
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
                disabled={isFetching || shouldDisableControls}
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
              isFetching ||
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

export default StaffList;
