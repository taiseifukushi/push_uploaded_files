# diagram

## flowchart

```mermaid
flowchart LR
    subgraph gh-actions
    id1[(Google Drive)] -->|copy & upload| id2[(Cloud Storage)]
    end
    User -->|upload|gh-actions -->id3{{UploadEvent}}

    subgraph CloudFunctions
        subgraph Run
            id4[Download the Files]
            id5[Convert PDF file to text file]
            id6[Git Push]
        end
    end
    id3 -->|trigger|CloudFunctions --> |Push|id7[(Github Repo)]
```
