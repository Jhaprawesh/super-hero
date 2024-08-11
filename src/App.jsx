import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Container,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState([]);
  const [hero, setHero] = useState("All");
  const [show, setShow] = useState([]);

  useEffect(() => {
    fetch("https://thronesapi.com/api/v2/Characters")
      .then((res) => res.json())
      .then((data) => {
        // Check the data format and structure
        console.log("Fetched data:", data);
        setData(data);
        setShow(data);
        setLoading(false);

        // Get unique family names for filtering
        const families = [...new Set(data.map((char) => char.family))];
        setFilter(families);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });

    AOS.init();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleChange = (event) => {
    setHero(event.target.value);
  };

  useEffect(() => {
    let filteredData = data;

    if (search) {
      // Filter by search term
      filteredData = filteredData.filter((character) =>
        character.fullName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (hero !== "All") {
      // Filter by selected family
      filteredData = filteredData.filter(
        (character) => character.family === hero
      );
    }

    setShow(filteredData);
  }, [data, search, hero]);

  return (
    <Container sx={{ paddingBlock: "2rem" }}>
      {loading ? (
        <Box
          sx={{
            textAlign: "center",
            blockSize: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ marginBlockStart: ".75rem" }}>
            Loading...
          </Typography>
        </Box>
      ) : (
        <>
          <Typography
            variant="h4"
            sx={{ textAlign: "center", fontWeight: "700", color: "#d9480f" }}
          >
            Game of Thrones Characters
          </Typography>

          <Box
            sx={{
              marginInline: "auto",
              paddingBlock: "2rem",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search..."
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="family-select-label">Family</InputLabel>
                  <Select
                    labelId="family-select-label"
                    id="family-select"
                    value={hero}
                    onChange={handleChange}
                    label="Family"
                  >
                    <MenuItem value="All">All</MenuItem>
                    {filter.map((charHome, index) => (
                      <MenuItem value={charHome} key={index}>
                        {charHome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* <Box sx={{ minWidth: 120, marginBottom: 2 }}></Box> */}

          {show.length > 0 ? (
            <Grid container spacing={4}>
              {show.map((character) => (
                <Grid
                  data-aos="fade-up"
                  key={character.id}
                  item
                  xs={12}
                  md={6}
                  lg={3}
                >
                  <Box
                    sx={{
                      padding: "1.5rem",
                      textAlign: "center",
                      boxShadow:
                        "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;",
                      borderRadius: "8px",
                    }}
                  >
                    <Box
                      component="img"
                      src={character.imageUrl}
                      alt={character.fullName}
                      sx={{
                        borderRadius: "10px",
                        display: "block",
                        width: "100%",
                        maxWidth: "100%",
                        height: "200px",
                        objectFit: "contain",
                        marginBlockEnd: ".5rem",
                      }}
                    />
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {character.fullName}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: character.status === "Alive" ? "green" : "red",
                      }}
                    >
                      {character.title}
                    </Typography>
                    <Stack spacing={1} alignItems="center">
                      <Stack direction="row" spacing={1}>
                        <Chip label="primary" color="primary" />
                        <Chip label="success" color="success" />
                      </Stack>
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: "center", paddingBlock: "2rem" }}>
              <Typography
                variant="h6"
                sx={{ color: "#c92a2a", fontWeight: "600" }}
              >
                No Data Found
              </Typography>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

export default App;
