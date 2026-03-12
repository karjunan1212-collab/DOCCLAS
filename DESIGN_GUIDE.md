# Document Processing Application

A sophisticated Angular 17 application featuring 5 different UI design options for document processing workflow. Each design offers a unique visual representation of a multi-stage document processing system with 5 agents:

1. **Agent 1**: Read Document
2. **Agent 2**: Perform OCR
3. **Agent 3**: Make Document Searchable
4. **Agent 4**: Classification (Invoice/Billing)
5. **Agent 5**: Final Outcome

## Features

✨ **5 Beautiful Design Options**:
1. **Modern Minimalist** - Clean, simple horizontal step indicators
2. **Card-Based Design** - Beautiful cards with progress indicators
3. **Timeline View** - Vertical timeline workflow visualization
4. **Circular Progress** - Circular workflow with steps around progress circle
5. **Dashboard Style** - Comprehensive dashboard with multiple panels

🎯 **Core Features**:
- Document upload functionality
- Step-by-step workflow progression
- Progress tracking and visualization
- Dummy script execution (simulated 2-second processing for each step)
- Responsive design works on all devices
- Bootstrap 5 styling with custom enhancements

## Project Structure

```
document-processing-app/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── design-minimalist/       (Design 1)
│   │   │   ├── design-card-based/       (Design 2)
│   │   │   ├── design-timeline/         (Design 3)
│   │   │   ├── design-circular/         (Design 4)
│   │   │   └── design-dashboard/        (Design 5)
│   │   ├── services/
│   │   │   └── document.service.ts      (Workflow logic & script execution)
│   │   └── app.component.ts             (Main component with design selector)
│   ├── main.ts
│   ├── index.html
│   └── styles.css                       (Global styles)
├── angular.json                         (Angular CLI configuration)
└── package.json                         (Dependencies)
```

## Installation & Setup

### Prerequisites
- Node.js 20.12.0 or higher
- Angular CLI 17.3.0 or higher

### Installation Steps

1. Navigate to the project directory:
```bash
cd document-processing-app
```

2. Install dependencies (already installed):
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to:
```
http://localhost:4200
```

## Running the Application

### Design Selection
When you first launch the application, you'll see a design selector screen showcasing all 5 design options. Click on any design card to select it.

### Using the Application

1. **Upload Document**: Click the upload area or drag a file to upload
2. **Execute Steps**: Click the "Next Step" or "Execute Next Step" button to process each stage
3. **Monitor Progress**: Watch real-time progress updates and visual indicators
4. **Complete Processing**: Once all 5 steps are completed, you can process another document

## Design Descriptions

### Design 1: Modern Minimalist ✨
- Clean horizontal step indicators
- Minimalist color scheme
- Simple and elegant interface
- Perfect for professional settings
- **Best for**: Users who prefer simplicity and clean aesthetics

### Design 2: Card-Based Design 🎨
- Beautiful gradient background
- Card-based step visualization
- Progress percentage indicator
- Overall progress bar
- Status badges for each step
- **Best for**: Visual representation of process stages

### Design 3: Timeline View 📅
- Vertical timeline layout
- Left panel with upload and status
- Right panel with timeline visualization
- Connector lines between steps
- Active step highlighting
- **Best for**: Sequential step-by-step visualization

### Design 4: Circular Progress ⭕
- Circular progress visualization
- Steps arranged in a circle
- Side panel with step details
- Percentage and step information
- **Best for**: Unique and engaging visualization

### Design 5: Dashboard Style 📊
- Professional dashboard layout
- Multiple panels (upload, workflow, stats)
- Real-time statistics
- Progress visualization bars
- Comprehensive workflow information
- **Best for**: Data-rich professional environments

## Service Layer

### DocumentService
Located in `src/app/services/document.service.ts`

**Key Methods**:
- `uploadDocument(file: File)`: Uploads and initializes document processing
- `getSteps()`: Returns array of processing steps
- `executeNextStep()`: Executes the next processing step
- `isAllCompleted()`: Checks if all steps are completed
- `canProcessNext()`: Validates if processing can continue

**Processing Simulation**:
Each step execution currently simulates a 2-second processing delay. In a real implementation, this would call an API endpoint that executes Linux scripts like:
```bash
/scripts/agent-read-document.sh
/scripts/agent-ocr.sh
/scripts/agent-make-searchable.sh
/scripts/agent-classify-document.sh
/scripts/agent-final-outcome.sh
```

## Future Enhancements

- [ ] Integrate actual Linux script execution via API
- [ ] Add file validation and error handling
- [ ] Implement real OCR processing
- [ ] Add document preview functionality
- [ ] Implement backend API for script execution
- [ ] Add user authentication
- [ ] Database integration for document history
- [ ] Email notifications on completion
- [ ] More design options
- [ ] Internationalization (i18n)

## Technology Stack

- **Framework**: Angular 17
- **Styling**: Bootstrap 5 + Custom CSS
- **State Management**: RxJS BehaviorSubject
- **Language**: TypeScript
- **Package Manager**: npm

## Building for Production

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## Troubleshooting

### Port 4200 already in use
```bash
ng serve --port 4300
```

### Module not found errors
```bash
npm install
```

### Bootstrap not loading
Check that `angular.json` includes:
```json
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "src/styles.css"
]
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of a document processing application suite.

## Notes

- Each processing step is set to 2 seconds delay to simulate script execution
- Files are processed in memory; implement backend for persistence
- Responsive breakpoints are optimized for mobile and desktop views
- All designs use standalone Angular components for modularity

---

**Created**: March 2026
**Version**: 1.0.0
**Status**: Ready for Design Selection
