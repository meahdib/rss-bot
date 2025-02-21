export const errorPage = () => {
  return `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>500 - Internal Server Error</title>
      <script src="/assets/global.js"></script>
      <link rel="stylesheet" href="/assets/css/all.min.css" />
      
</head>
<body class="bg-gray-900 text-white flex items-center justify-center h-screen">
    <div class="text-center p-6">
        <i class="fas fa-exclamation-triangle text-red-500 text-6xl mb-4"></i>
        <h1 class="text-4xl font-bold">500 - Internal Server Error</h1>
        <p class="text-gray-400 mt-2">Oops! Something went wrong on our end.</p>
        <p class="text-gray-400">Please try again later or contact support.</p>
        <a href="/" class="mt-6 inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all">
            <i class="fas fa-home"></i> Go Home
        </a>
    </div>
</body>
</html>
        `;
};
