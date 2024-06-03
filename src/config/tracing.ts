import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { AmqplibInstrumentation } from '@opentelemetry/instrumentation-amqplib';
import { FastifyInstrumentation } from '@opentelemetry/instrumentation-fastify';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { MongoDBInstrumentation } from '@opentelemetry/instrumentation-mongodb';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';
import { RedisInstrumentation } from '@opentelemetry/instrumentation-redis';
import { Resource } from '@opentelemetry/resources';
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import CONFIG from './env-config';

// Configure the trace exporter
const traceExporter = CONFIG.OBSERVABILITY.LOCAL
  ? new ConsoleSpanExporter()
  : new OTLPTraceExporter({
      url: 'http://tempo:4318/v1/traces',
    });

// Configure the span processor
const spanProcessor = CONFIG.OBSERVABILITY.LOCAL
  ? new SimpleSpanProcessor(traceExporter)
  : new BatchSpanProcessor(traceExporter);

// Create the tracer provider
const tracerProvider = new NodeTracerProvider({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: process.env.CONTEXT ?? 'default-service',
  }),
});

// Add the span processor to the tracer provider
tracerProvider.addSpanProcessor(spanProcessor);

// Register instrumentations
registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new FastifyInstrumentation(),
    new MongoDBInstrumentation(),
    new PgInstrumentation(),
    new RedisInstrumentation(),
    new AmqplibInstrumentation(),
    new PinoInstrumentation({
      logHook: (_, record) => {
        record['resource.service.name'] = CONFIG.APP.CONTEXT;
      },
      logKeys: {
        traceId: 'traceId',
        spanId: 'spanId',
        traceFlags: 'traceFlags',
      },
    }),
  ],
  tracerProvider,
});

// Initialize the tracer provider
tracerProvider.register();

console.log('Tracing initialized');

// Graceful shutdown
process.on('SIGTERM', async () => {
  try {
    await tracerProvider.shutdown();
    console.log('Tracing terminated');
  } catch (error) {
    console.log('Error terminating tracing', error);
  } finally {
    process.exit(0);
  }
});

// Create a sample span for testing
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('example-tracer');

const span = tracer.startSpan('test-span');
span.setAttribute('test-attribute', 'test-value');
span.addEvent('test-event');
span.end();

console.log('Test span created');
