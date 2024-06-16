"use client";
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { ExternalLink } from "lucide-react";
import { ProjectDonation } from "@/types/ProjectTypes";
import axios from "axios";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

type EtherscanTransaction = {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  methodId: string;
  functionName: string;
};

type EtherscanResponse = {
  status: string;
  message: string;
  result: EtherscanTransaction[];
};

type TransactionTableProps = {
  projectId: string;
};

const GOERLI_BLOCK_EXPLORER_URL = 'https://goerli.etherscan.io';

export const columns: ColumnDef<ProjectDonation>[] = [
  {
    accessorKey: 'contributor',
    header: 'Contributor',
    cell: info => {
      const contributor = info.getValue() as string;
      return (
        <a
          href={`${GOERLI_BLOCK_EXPLORER_URL}/address/${contributor}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-x-2 hover:text-purple-800 text-purple-300"
        >
          <p className="truncate">{contributor}</p>
          <ExternalLink className="w-4 h-4" />
        </a >
      )
    }
  },
  {
    accessorKey: 'contributedAmount',
    header: 'Amount (ETH)',
    cell: info => `${info.getValue()} ETH`
  },
  {
    accessorKey: 'projectAddress',
    header: 'Project Address',
    cell: info => {
      const projectAddress = info.getValue() as string;
      return (
        <a
          href={`${GOERLI_BLOCK_EXPLORER_URL}/address/${projectAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-x-2 hover:text-purple-800 text-purple-300"
        >
          <p className="truncate">{projectAddress}</p>
          <ExternalLink className="w-4 h-4" />
        </a>
      )
    }

  }
];

export const TransactionTable: React.FC<TransactionTableProps> = ({ projectId }) => {
  const [transactionsData, setTransactionsData] = useState<ProjectDonation[]>([]); // New state for fetched transactions
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;
  const ETHERSCAN_API_URL = `https://api-goerli.etherscan.io/api`;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${ETHERSCAN_API_URL}`, {
          params: {
            module: 'account',
            action: 'txlist',
            address: projectId,
            startblock: 0,
            endblock: 99999999,
            sort: 'asc',
            apikey: ETHERSCAN_API_KEY
          }
        });

        const transformedData: ProjectDonation[] = response.data.result.map((tx: EtherscanTransaction) => ({
          contributor: tx.from,
          contributedAmount: ethers.utils.formatEther(tx.value),
          projectAddress: tx.to
        }));
        console.log(transformedData)

        setTransactionsData(transformedData);
      } catch (error) {
        console.error(`Error fetching transactions: ${error}`);
      }
    }

    fetchTransactions();
  }, [projectId]);


  const table = useReactTable({
    data: transactionsData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  });

  return (
    <div className="my-8 w-full">
      <div className="rounded-md border border-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead className="text-white" key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No transactions.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
