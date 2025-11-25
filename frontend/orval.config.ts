export default {
    backend: {
        input: '../docs/api-docs.yaml',
        output: {
            target: './src/api/backend.ts',
            schemas: './src/api/model',
            client: 'axios',
            baseUrl: 'http://localhost:8080'
        },
        override: {
            mutator: {
                path: './src/api/axiosInstance.ts',
            },
        },
    },
};