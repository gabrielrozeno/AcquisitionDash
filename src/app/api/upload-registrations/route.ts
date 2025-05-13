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

    console.log('Processing file:', file.name);
    const fileContent = await file.text();
    console.log('File content:', fileContent);

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ',',
    });

    console.log('Parsed records:', records);

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
          const date = new Date(`${year}-${month}-${day}`);

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

          // Create the data object with the correct field names
          const data = {
            date,
            platform: record.platform,
            spend,
            ftds,
            leads: 0,
            registrations,
          };

          console.log('Creating record with data:', data);
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