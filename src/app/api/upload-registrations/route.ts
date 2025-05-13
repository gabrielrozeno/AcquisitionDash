import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parse } from 'csv-parse/sync';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const fileContent = await file.text();
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ',',
    });

    if (!records.length) {
      return NextResponse.json(
        { error: 'No valid records found in CSV' },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = ['date', 'platform', 'spend', 'registrations', 'ftds'];
    const missingFields = requiredFields.filter(field => !records[0][field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      records.map(async (record: any) => {
        try {
          const [day, month, year] = record.date.split('/');
          const parsedDay = parseInt(day);
          const parsedMonth = parseInt(month);
          const parsedYear = parseInt(year);
          
          // Create date in UTC at noon to avoid timezone issues
          const date = new Date(Date.UTC(parsedYear, parsedMonth - 1, parsedDay, 12, 0, 0, 0));

          if (isNaN(date.getTime())) {
            throw new Error(`Invalid date format: ${record.date}`);
          }

          const spend = parseFloat(record.spend);
          if (isNaN(spend)) {
            throw new Error(`Invalid spend value: ${record.spend}`);
          }

          const registrations = parseInt(record.registrations);
          if (isNaN(registrations)) {
            throw new Error(`Invalid registrations value: ${record.registrations}`);
          }

          const ftds = parseInt(record.ftds);
          if (isNaN(ftds)) {
            throw new Error(`Invalid ftds value: ${record.ftds}`);
          }

          const data = {
            date,
            platform: record.platform,
            spend,
            ftds,
            leads: 0,
            registrations,
          };

          return prisma.adSpend.create({ data });
        } catch (error) {
          console.error('Error processing record:', record, error);
          throw error;
        }
      })
    );

    return NextResponse.json({ 
      message: 'Data uploaded successfully',
      count: results.length 
    });
  } catch (error) {
    console.error('Error processing CSV:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error processing CSV file' },
      { status: 500 }
    );
  }
} 