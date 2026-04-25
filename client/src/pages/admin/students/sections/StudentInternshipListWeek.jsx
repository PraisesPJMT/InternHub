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
import Button from "@/components/ui/button";
import { Link, useParams } from "react-router";
import EmptyState from "@/components/general/EmptyState";
import ErrorState from "@/components/general/ErrorState";
import LoadingState from "@/components/general/LoadingState";

const StudentInternshipListWeek = () => {
  // Table State
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const { studentId, internshipId } = useParams();

  // TanStack Query Integration
  const { data, isLoading, isError, error, isPlaceholderData, refetch } =
    useQuery({
      queryKey: ["internship-weeks", studentId, internshipId, page, limit],
      queryFn: () => {
        // Mock data for demonstration purposes
        return Promise.resolve({
          count: 20,
          data: [
            {
              id: "week-id-01",
              name: "Week 01",
              logData: [
                {
                  day: "2025-01-06",
                  isLogged: true,
                },
                {
                  day: "2025-01-07",
                  isLogged: true,
                },
                {
                  day: "2025-01-08",
                  isLogged: true,
                },
                {
                  day: "2025-01-09",
                  isLogged: true,
                },
                {
                  day: "2025-01-10",
                  isLogged: true,
                },
                {
                  day: "2025-01-11",
                  isLogged: false,
                },
              ],
              isEndorsed: true,
            },
            {
              id: "week-id-02",
              name: "Week 02",
              logData: [
                {
                  day: "2025-01-13",
                  isLogged: true,
                },
                {
                  day: "2025-01-14",
                  isLogged: true,
                },
                {
                  day: "2025-01-15",
                  isLogged: true,
                },
                {
                  day: "2025-01-16",
                  isLogged: true,
                },
                {
                  day: "2025-01-17",
                  isLogged: true,
                },
                {
                  day: "2025-01-18",
                  isLogged: false,
                },
              ],
              isEndorsed: true,
            },
            {
              id: "week-id-03",
              name: "Week 03",
              logData: [
                {
                  day: "2025-01-20",
                  isLogged: true,
                },
                {
                  day: "2025-01-21",
                  isLogged: true,
                },
                {
                  day: "2025-01-22",
                  isLogged: false,
                },
                {
                  day: "2025-01-23",
                  isLogged: false,
                },
                {
                  day: "2025-01-24",
                  isLogged: false,
                },
                {
                  day: "2025-01-25",
                  isLogged: false,
                },
              ],
              isEndorsed: false,
            },
            {
              id: "week-id-04",
              name: "Week 04",
              logData: [
                {
                  day: "2025-01-27",
                  isLogged: false,
                },
                {
                  day: "2025-01-28",
                  isLogged: false,
                },
                {
                  day: "2025-01-29",
                  isLogged: false,
                },
                {
                  day: "2025-01-30",
                  isLogged: false,
                },
                {
                  day: "2025-01-31",
                  isLogged: false,
                },
                {
                  day: "2025-02-01",
                  isLogged: false,
                },
              ],
              isEndorsed: false,
            },
          ],
        });
      },
      placeholderData: keepPreviousData,
    });

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: () => <div className="text-left">Week</div>,
        cell: ({ row }) => (
          <div className="text-left">
            {row.original.firstName} {row.original.name}
          </div>
        ),
      },
      {
        accessorKey: "logData",
        header: () => <div className="text-center">Daily Logs</div>,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.logData.map((entry) => (
              <div className="flex flex-col items-center justify-center gap-0.5">
                <p className="text-xs text-gray-700 text-center">
                  {new Date(entry.day)
                    .toLocaleDateString("en-US", { weekday: "short" })
                    .toUpperCase()}
                </p>
                <div
                  className={`rounded w-7 h-5 ${entry.isLogged ? "bg-green-500" : "bg-gray-400"}`}
                  title={new Date(entry.day).toLocaleDateString("en-US")}
                ></div>
              </div>
            ))}
          </div>
        ),
      },
      {
        accessorKey: "isEndorsed",
        header: () => <div className="text-center">Weekly Endorsement</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <span
              className={`py-1 px-2 rounded-xl border text-xs ${row.original.isEndorsed ? "text-green-500 border-green-500 bg-green-100" : "text-gray-500 border-gray-500 bg-gray-100"}`}
            >
              {row.original.isEndorsed ? "Endorsed" : "Not Endorsed"}
            </span>
          </div>
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
      <h2 className="text-sm md:text-sm font-bold">Internship Weeks</h2>

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
                    title="Failed to load Internship weeks"
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
                    title="No Internship Log"
                    description="No Internship weeks found"
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

export default StudentInternshipListWeek;
