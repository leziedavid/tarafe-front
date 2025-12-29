'use client';

import * as React from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export interface GraphData {
  date: string;
  value: number;
  label: string;
}

interface PieGraphProps {
  data: GraphData[];
  title: string;
}

// Palette de couleurs
function generateColor(index: number): string {
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#7FB800', '#F45B69', '#5D9CEC', '#D7263D',
    '#1B998B', '#2E294E', '#FFD23F', '#E84855', '#009FB7'
  ];
  return colors[index % colors.length];
}

// Fonction de calcul du total
function getTotalValue(data: GraphData[]): number {
  return data.reduce((sum, item) => sum + item.value, 0);
}

export function PieGraph({ data, title }: PieGraphProps) {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const total = getTotalValue(data);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-center text-md">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={{}} className="mx-auto aspect-square max-h-[360px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="value" nameKey="label" innerRadius={90} strokeWidth={80}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={generateColor(index)} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Total : <strong>{total.toLocaleString('fr-FR')}</strong>
        </div>
      </CardFooter>
    </Card>
  );
}
