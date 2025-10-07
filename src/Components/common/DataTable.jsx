import {useReactTable} from "@tanstack/react-table";
import {
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
} from "@tanstack/react-table";

const DataTable = ({columns, data}) => {
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="overflow-scroll w-full">
            <table className="table-auto overflow-scroll w-full border-collapse bg-white text-sm min-w-[600px]">
                <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="bg-gray-100 border-b border-gray-200">
                        {headerGroup.headers.map((header) => (
                            <th
                                key={header.id}
                                className="px-6 py-3 font-semibold text-gray-700 text-center uppercase tracking-wider"
                            >
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map((row, rowIndex) => (
                    <tr
                        key={row.id}
                        className={`border-b ${
                            rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-100`}
                    >
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-6 py-3 text-gray-600 text-center">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
