import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend running on port http://127.0.0.1:${PORT}`);
});