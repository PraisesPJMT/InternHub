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
import { Link } from "react-router";
import EmptyState from "@/components/general/EmptyState";
import ErrorState from "@/components/general/ErrorState";
import LoadingState from "@/components/general/LoadingState";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- MOCK API FUNCTION ---
const fetchStudents = async ({ page, limit, sortBy, sortOrder, search }) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Uncomment to simulate an error:
  // throw new Error("Failed to fetch faculties");

  // In a real app, you'd fetch from your API:
  // e.g., `/api/faculties?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}`
  console.log("Fetching with params:", {
    page,
    limit,
    sortBy,
    sortOrder,
    search,
  });

  return {
    data: [
      {
        id: "student-id-1",
        firstName: "John",
        lastName: "Doe",
        faculty: "School of Computing",
        department: "Computer Science",
        isActiveIntern: true,
        internships: 2,
      },
      {
        id: "student-id-1",
        firstName: "Alice",
        lastName: "Smith",
        faculty: "School of Management",
        department: "Business Administration",
        isActiveIntern: false,
        internships: 1,
      },
      {
        id: "student-id-1",
        firstName: "Bob",
        lastName: "Johnson",
        faculty: "School of Health",
        department: "Public Health",
        isActiveIntern: true,
        internships: 0,
      },
      {
        id: "student-id-1",
        firstName: "Charlie",
        lastName: "Brown",
        faculty: "School of Management",
        department: "Public Administration",
        isActiveIntern: false,
        internships: 2,
      },
    ],
    meta: {
      total: 0,
      page: page,
      limit: limit,
      totalPages: Math.ceil(42 / limit),
    },
  };
};

const StudentList = () => {
  // Table State
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [internshipStatus, setInternshipStatus] = useState("all");
  const [search, setSearch] = useState("");

  // TanStack Query Integration
  const { data, isLoading, isError, error, isPlaceholderData, refetch } =
    useQuery({
      queryKey: [
        "students",
        page,
        limit,
        sortBy,
        sortOrder,
        search,
        internshipStatus,
      ],
      queryFn: () =>
        fetchStudents({
          page,
          limit,
          sortBy,
          sortOrder,
          search,
          internshipStatus,
        }),
      placeholderData: keepPreviousData,
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
        accessorKey: "facultty",
        header: () => <div className="text-center">Faculty</div>,
        cell: ({ row }) => (
          <div className="text-center">{row.original.faculty}</div>
        ),
      },
      {
        accessorKey: "department",
        header: () => <div className="text-center">Program</div>,
        cell: ({ row }) => (
          <div className="text-center">{row.original.department}</div>
        ),
      },
      {
        accessorKey: "isActiveIntern",
        header: () => <div className="text-center">Internship Status</div>,
        cell: ({ row }) => {
          const isActive = row.original.isActiveIntern;

          return (
            <div className="flex justify-center">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  isActive
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-gray-100 text-gray-600 border border-gray-200"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "internships",
        header: () => <div className="text-center">Internship</div>,
        cell: ({ row }) => (
          <div className="text-center">{row.original.internships}</div>
        ),
      },
      {
        accessorKey: "id",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-2">
            <Link
              to={row.original.id}
              className="py-1 px-3 rounded-lg border border-primary text-primary hover:opacity-70"
            >
              View
            </Link>
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
            Internship:
          </span>

          <Select
            value={internshipStatus}
            onValueChange={(value) => {
              setInternshipStatus(value);
              setPage(1);
            }}
            disabled={shouldDisableControls}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
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

export default StudentList;
