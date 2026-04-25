import React, { useState, useMemo, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useNavigate } from "react-router";

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
import EmptyState from "@/components/general/EmptyState";
import ErrorState from "@/components/general/ErrorState";
import LoadingState from "@/components/general/LoadingState";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ---------------- MOCK DATA ---------------- */

const internships = [
  {
    id: "uuid-1",
    name: "Student Industrial Work Experience Scheme I",
    code: "SIWES I",
  },
  {
    id: "uuid-2",
    name: "Student Industrial Work Experience Scheme II",
    code: "SIWES II",
  },
  { id: "uuid-3", name: "Student Industrial Training", code: "IT" },
  { id: "uuid-4", name: "Student Work Experience Program", code: "SWEP" },
];

const STATUSES = ["pending", "approved", "rejected"];
const DEPARTMENTS = [
  "Computer Science",
  "Mechanical Engineering",
  "Accounting",
  "Electrical Engineering",
  "Business Administration",
];

const ORGANISATIONS = [
  "Tech Corp Ltd",
  "Global Manufacturing",
  "FinServe Group",
  "PowerGrid Systems",
  "NextGen Solutions",
];

const generateMockRequests = () =>
  Array.from({ length: 37 }).map((_, index) => {
    const internship = internships[index % internships.length];

    return {
      id: `req-${index + 1}`,
      firstName: `Student${index + 1}`,
      lastName: `Lastname${index + 1}`,
      email: `student${index + 1}@email.com`,
      phone: `08000000${index}`,
      department: DEPARTMENTS[index % DEPARTMENTS.length],
      internship,
      organisation: ORGANISATIONS[index % ORGANISATIONS.length],
      organisationAddress: `${index + 10} Business Street`,
      startDate: new Date(2024, index % 12, (index % 28) + 1).toISOString(),
      endDate: new Date(2024, (index % 12) + 5, (index % 28) + 1).toISOString(),
      status: STATUSES[index % STATUSES.length],
      supervisor: {
        firstName: "Supervisor",
        lastName: `${index}`,
        email: `supervisor${index}@email.com`,
        phone: `09000000${index}`,
      },
    };
  });

const ALL_REQUESTS = generateMockRequests();

const fetchDepartments = async () => {
  await new Promise((r) => setTimeout(r, 300));
  return DEPARTMENTS.map((name, i) => ({ id: `dept-${i}`, name }));
};

const fetchInternshipRequests = async ({
  page,
  limit,
  sortBy,
  sortOrder,
  search,
}) => {
  await new Promise((r) => setTimeout(r, 500));

  let filtered = [...ALL_REQUESTS];

  if (search) {
    const lower = search.toLowerCase();
    filtered = filtered.filter((item) =>
      `${item.firstName} ${item.lastName} ${item.email} ${item.organisation}`
        .toLowerCase()
        .includes(lower),
    );
  }

  filtered.sort((a, b) => {
    let valueA;
    let valueB;

    switch (sortBy) {
      case "name":
        valueA = `${a.firstName} ${a.lastName}`;
        valueB = `${b.firstName} ${b.lastName}`;
        break;
      case "department":
        valueA = a.department;
        valueB = b.department;
        break;
      case "status":
        valueA = a.status;
        valueB = b.status;
        break;
      case "startDate":
        valueA = new Date(a.startDate);
        valueB = new Date(b.startDate);
        break;
      default:
        return 0;
    }

    if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
    if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);

  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    data: filtered.slice(start, end),
    meta: { total, page, limit, totalPages },
  };
};

/* ---------------- COMPONENT ---------------- */

const InternshipRequestList = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch, isPlaceholderData } =
    useQuery({
      queryKey: ["internship-requests", page, limit, sortBy, sortOrder, search],
      queryFn: () =>
        fetchInternshipRequests({ page, limit, sortBy, sortOrder, search }),
      placeholderData: keepPreviousData,
    });

  useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  });

  useEffect(() => {
    if (page > (data?.meta?.totalPages || 1)) {
      setPage(1);
    }
  }, [data?.meta?.totalPages]);

  const columns = useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: () => <div>Name</div>,
        cell: ({ row }) => (
          <div>
            <div className="font-medium">
              {row.original.firstName} {row.original.lastName}
            </div>
            <div className="text-xs text-muted-foreground">
              {row.original.email}
            </div>
          </div>
        ),
      },
      {
        id: "department",
        accessorKey: "department",
        header: () => <div>Department</div>,
      },
      {
        id: "internship",
        accessorKey: "internship",
        header: () => <div>Internship</div>,
        cell: ({ row }) => row.original.internship.code,
      },
      {
        id: "organisation",
        accessorKey: "organisation",
        header: () => <div>Organisation</div>,
      },
      {
        id: "startDate",
        accessorKey: "startDate",
        header: () => <div>Start Date</div>,
        cell: ({ row }) =>
          new Date(row.original.startDate).toLocaleDateString(),
      },
      {
        id: "status",
        accessorKey: "status",
        header: () => <div>Status</div>,
        cell: ({ row }) => {
          const status = row.original.status;

          const styles = {
            pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
            approved: "bg-green-50 text-green-700 border-green-200",
            rejected: "bg-red-50 text-red-700 border-red-200",
          };

          return (
            <span
              className={`capitalize px-2 py-1 text-xs font-medium rounded-md border ${styles[status]}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Icon icon="iwwa:option" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={() => navigate(row.original.id)}>
                  View
                </DropdownMenuItem>

                {(row.original.status === "pending" ||
                  row.original.status === "rejected") && (
                  <DropdownMenuItem
                    onClick={() => navigate(row.original.id + "/approve")}
                  >
                    Approve
                  </DropdownMenuItem>
                )}

                {(row.original.status === "pending" ||
                  row.original.status === "approved") && (
                  <DropdownMenuItem
                    onClick={() => navigate(row.original.id + "/reject")}
                  >
                    Reject
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={() => navigate(row.original.id + "/delete")}
                  className="text-red-600 focus:bg-red-50 focus:text-red-700"
                >
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

  const handleSortChange = (value) => {
    const [field, order] = value.split("-");
    setSortBy(field);
    setSortOrder(order);
    setPage(1);
  };

  const hasData = data?.data?.length > 0;
  const isEmpty = !isLoading && !isError && !hasData;

  return (
    <div className="p-5 rounded-xl border space-y-4">
      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2 max-w-sm w-full">
          <Icon icon="iconamoon:search-thin" width="20" />
          <Input
            placeholder="Search requests..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <Select
          value={`${sortBy}-${sortOrder}`}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="department-asc">Department (A-Z)</SelectItem>
            <SelectItem value="department-desc">Department (Z-A)</SelectItem>
            <SelectItem value="status-asc">Status (A-Z)</SelectItem>
            <SelectItem value="status-desc">Status (Z-A)</SelectItem>
            <SelectItem value="startDate-asc">Start Date (Oldest)</SelectItem>
            <SelectItem value="startDate-desc">Start Date (Newest)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
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
                <TableCell colSpan={columns.length}>
                  <LoadingState message="Loading requests..." />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <ErrorState
                    title="Failed to load requests"
                    description={error?.message}
                    onButtonClick={refetch}
                  />
                </TableCell>
              </TableRow>
            ) : isEmpty ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <EmptyState
                    title="No internship requests found"
                    description={
                      search
                        ? `No results found for "${search}".`
                        : "There are no internship requests."
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
    </div>
  );
};

export default InternshipRequestList;
