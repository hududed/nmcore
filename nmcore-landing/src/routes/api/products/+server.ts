import type { RequestHandler } from '@sveltejs/kit';
import { promises as fs } from 'fs';
import path from 'path';

export const GET: RequestHandler = async () => {
  const filePath = path.resolve('static', 'mockProduct.json');
  const data = await fs.readFile(filePath, 'utf-8');
  const products = JSON.parse(data);

  return new Response(JSON.stringify(products), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};