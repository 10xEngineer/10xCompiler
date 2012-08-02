
import java.io.BufferedReader;
import java.io.InputStreamReader;

class Sample {
	public static void main(String[] args) throws Exception {
		BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
		String input;
		while((input = reader.readLine()) != null) {
			System.out.println(input)
		}
	}
}