'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export interface GraphData {
  date: string; // Format : "2023-04-30" (brut de la base)
  value: number;
  label: string;
  color: string; // facultatif ici, car on génère en JS
}

interface BarGraphProps {
  data: GraphData[];
  title: string;
  types: string; // 'date', 'operation', or 'categories'
}

const chartConfig = {
  views: {
    label: 'Page Views'
  }
} satisfies ChartConfig;

// Fonction de génération de couleurs à partir d'une palette
function generateColor(index: number): string {
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#7FB800', '#F45B69', '#5D9CEC', '#D7263D',
    '#1B998B', '#2E294E', '#FFD23F', '#E84855', '#009FB7'
  ];
  return colors[index % colors.length];
}

// Fonction utilitaire pour parser une date "YYYY-MM-DD" en date sans décalage
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day); // mois commence à 0
}


export function BarGraph({ data, title, types }: BarGraphProps) {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle className="text-center text-md">{title}</CardTitle>
          </CardHeader>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={types === 'date' ? 'date' : 'label'} // Dynamique en fonction du type
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                if (types === 'date') {
                  // Si le type est "date", formater la date en français
                  const date = parseLocalDate(value);
                  return date.toLocaleDateString('fr-FR', {
                    month: 'short',
                    day: 'numeric',
                  });
                }
                // Si c'est "operation" ou "categories", juste retourner le label
                return value;
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="value"
                  labelFormatter={(value) => {
                    if (types === 'date') {
                    const date = parseLocalDate(value);
                      return date.toLocaleDateString('fr-FR', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      });
                    }
                    return value;
                  }}
                />
              }
            />
            <Bar dataKey="value" isAnimationActive={false}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={generateColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
