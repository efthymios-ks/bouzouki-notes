$csvPath = "Songs.csv"
$jsPath  = "Songs.js"

# Import with UTF8 and match header names exactly
$rows = Import-Csv $csvPath -Delimiter "," -Encoding UTF8
$index = 1

$lines = $rows | ForEach-Object {
  # Use exact CSV header names
  if (-not $_."Name")         { throw "Row ${index}: Name is required" }
  if (-not $_."MakamScaleId") { throw "Row ${index}: MakamScaleId is required" }
  if (-not $_."Author")       { throw "Row ${index}: Author is required" }

  $name   = $_."Name"         -replace '"','\"'
  $makam  = $_."MakamScaleId" -replace '"','\"'
  $author = $_."Author"       -replace '"','\"'
  $year   = if ($_.Year) { ", year: $($_.Year)" } else { "" }

  $index++

  "  { name: `"$name`", makamIds: [`"$makam`"], authors: [`"$author`"]$year }"
}

@(
"export default ["
($lines -join ",`n")
"];"
) | Set-Content -Encoding UTF8 $jsPath
