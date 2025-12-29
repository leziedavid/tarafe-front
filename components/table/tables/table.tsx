'use client';

import React, { ReactNode, useState } from "react";
import {
    Table as ShadTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Edit,
    Trash2,
    CheckCircle,
    Repeat,
    Users,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* =======================
   Types
======================= */

export interface Column<T> {
    key: keyof T | string;
    name: string;
    render?: (item: T) => ReactNode;
    /** Optionnel : Largeur fixe pour la colonne */
    width?: string;
    /** Optionnel : Empêche le texte de passer à la ligne */
    noWrap?: boolean;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];

    /** 🔑 ID générique (id, id_orders, uuid, etc.) */
    getRowId: (item: T) => string | number;

    onDelete?: (item: T) => void;
    onUpdate?: (item: T) => void;
    onActive?: (item: T) => void;
    onAffecte?: (item: T) => void;
    onChange?: (item: T) => void;
    onDeleteMultiple?: (items: T[]) => void;

    enableMultiple?: boolean;
    currentPage?: number;
    totalItems?: number;
    itemsPerPage?: number;
    onNextPage?: () => void;
    onPreviousPage?: () => void;
    /** Hauteur fixe optionnelle pour le conteneur de la table */
    tableHeight?: string;
}

/* =======================
   Component
======================= */

export function Table<T>({
    data,
    columns,
    getRowId,
    onDelete,
    onUpdate,
    onActive,
    onAffecte,
    onChange,
    onDeleteMultiple,
    enableMultiple = false,
    currentPage = 1,
    totalItems = 0,
    itemsPerPage = 10,
    onNextPage,
    onPreviousPage,
    tableHeight,
}: TableProps<T>) {
    const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set());

    const toggleSelect = (id: string | number) => {
        const newSet = new Set(selectedItems);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
        setSelectedItems(newSet);
    };

    const handleDeleteMultiple = () => {
        if (!onDeleteMultiple) return;

        const itemsToDelete = data.filter((item) =>
            selectedItems.has(getRowId(item))
        );

        onDeleteMultiple(itemsToDelete);
        setSelectedItems(new Set());
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className="w-full">
            {enableMultiple && selectedItems.size > 0 && (
                <div className="mb-2">
                    <Button variant="destructive" onClick={handleDeleteMultiple}>
                        Supprimer ({selectedItems.size}) sélectionnés
                    </Button>
                </div>
            )}

            <div className="rounded-md border overflow-hidden">
                <div
                    className="overflow-auto"
                    style={tableHeight ? { height: tableHeight } : undefined}
                >
                    <div className="min-w-full inline-block align-middle">
                        <ShadTable className="w-full">
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    {enableMultiple && (
                                        <TableHead
                                            className="sticky left-0 bg-muted/50 z-10"
                                            style={{ minWidth: '50px' }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={
                                                    data.length > 0 && selectedItems.size === data.length
                                                }
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedItems(new Set(data.map(getRowId)));
                                                    } else {
                                                        setSelectedItems(new Set());
                                                    }
                                                }}
                                            />
                                        </TableHead>
                                    )}

                                    {columns.map((col) => (
                                        <TableHead
                                            key={String(col.key)}
                                            className="whitespace-nowrap"
                                            style={{
                                                minWidth: col.width || 'auto',
                                                ...(col.noWrap && { whiteSpace: 'nowrap' })
                                            }}
                                        >
                                            {col.name}
                                        </TableHead>
                                    ))}

                                    {(onDelete || onUpdate || onActive || onChange || onAffecte) && (
                                        <TableHead
                                            className="text-right sticky right-0 bg-muted/50 z-10 whitespace-nowrap"
                                            style={{ minWidth: '100px' }}
                                        >
                                            Actions
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {data.map((item) => {
                                    const rowId = getRowId(item);

                                    return (
                                        <TableRow key={rowId} className="hover:bg-muted/50">
                                            {enableMultiple && (
                                                <TableCell
                                                    className="sticky left-0 bg-background z-10"
                                                    style={{ minWidth: '50px' }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedItems.has(rowId)}
                                                        onChange={() => toggleSelect(rowId)}
                                                    />
                                                </TableCell>
                                            )}

                                            {columns.map((col) => (
                                                <TableCell
                                                    key={String(col.key)}
                                                    className="max-w-xs overflow-hidden"
                                                    style={{
                                                        minWidth: col.width || 'auto',
                                                        ...(col.noWrap && { whiteSpace: 'nowrap' })
                                                    }}
                                                    title={!col.render ? String((item as any)[col.key] ?? "") : undefined}
                                                >
                                                    <div className="truncate">
                                                        {col.render
                                                            ? col.render(item)
                                                            : String((item as any)[col.key] ?? "")}
                                                    </div>
                                                </TableCell>
                                            ))}

                                            {(onDelete || onUpdate || onActive || onChange || onAffecte) && (
                                                <TableCell
                                                    className="text-right sticky right-0 bg-background z-10"
                                                    style={{ minWidth: '100px' }}
                                                >
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            {onAffecte && (
                                                                <DropdownMenuItem onClick={() => onAffecte(item)}>
                                                                    <Users className="h-4 w-4 mr-2" />
                                                                    Affecter un conducteur
                                                                </DropdownMenuItem>
                                                            )}

                                                            {onUpdate && (
                                                                <DropdownMenuItem onClick={() => onUpdate(item)}>
                                                                    <Edit className="h-4 w-4 mr-2" />
                                                                    Modifier
                                                                </DropdownMenuItem>
                                                            )}

                                                            {onDelete && (
                                                                <DropdownMenuItem onClick={() => onDelete(item)}>
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Supprimer
                                                                </DropdownMenuItem>
                                                            )}

                                                            {onActive && (
                                                                <DropdownMenuItem onClick={() => onActive(item)}>
                                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                                    Activer
                                                                </DropdownMenuItem>
                                                            )}

                                                            {onChange && (
                                                                <DropdownMenuItem onClick={() => onChange(item)}>
                                                                    <Repeat className="h-4 w-4 mr-2" />
                                                                    Changer
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </ShadTable>
                    </div>
                </div>
            </div>

            {(onNextPage || onPreviousPage) && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-2">
                    <div className="text-muted-foreground text-xs sm:text-sm">
                        Page {currentPage} sur {totalPages || 1}
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onPreviousPage}
                            disabled={currentPage <= 1}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Précédent
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onNextPage}
                            disabled={currentPage >= totalPages}
                        >
                            Suivant
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}